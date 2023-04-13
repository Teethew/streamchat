"use client";

import {
  PropsWithChildren,
  useEffect,
  useRef,
  Fragment,
  useState,
} from "react";

import { Peer } from "peerjs";
import axios from "axios";

type VideoCallProps = {
  id: string;
};

const VideoCall = ({ id, children }: PropsWithChildren<VideoCallProps>) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);

  const [streams, setStreams] = useState<MediaStream[]>([]);

  useEffect(() => {
    if (remoteVideosRef.current) {
      Array.from(remoteVideosRef.current.querySelectorAll("video")).forEach(
        (video, index) => {
          if (video.srcObject) return;
          video.srcObject = streams[index - 1];
        }
      );
    }
  }, [streams]);

  useEffect(() => {
    const peer = new Peer(
      `streamchat-${id}-${localStorage.getItem("username")}`
    );
    if (window) {
      peer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localVideoRef.current!.srcObject = stream;
            call.answer(stream);
            console.log("executou fora do on stream on call");
            call.on("stream", (remoteStream) => {
              if (!remoteVideosRef.current) return;
              console.log("executou on call");
              setStreams((prevStreams) => [
                ...prevStreams.filter((it) => it.id !== remoteStream.id),
                remoteStream,
              ]);
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      });
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current!.srcObject = stream;
          axios
            .get<{ id: number; usuario: string; sala: string }[]>(
              `https://streamchat-production.up.railway.app/current/${id}`
            )
            .then(({ data }) => {
              const otherUsers = data
                .map((it) => it.usuario)
                .filter((it) => it !== localStorage.getItem("username"));

              console.log(otherUsers);

              for (const user of otherUsers) {
                const call = peer.call(`streamchat-${id}-${user}`, stream);
                console.log("executou fora do on stream do call");
                call.on("stream", (remoteStream) => {
                  if (!remoteVideosRef.current) return;
                  console.log("executou do call");
                  setStreams((prevStreams) => [
                    ...prevStreams.filter((it) => it.id !== remoteStream.id),
                    remoteStream,
                  ]);
                });
              }
            });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    }
    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-5" ref={remoteVideosRef}>
        <video
          ref={localVideoRef}
          className="border border-white"
          playsInline
          autoPlay
          muted
        />
        {streams.map((_stream, index) => (
          <video
            key={index}
            className="border border-white"
            playsInline
            autoPlay
          />
        ))}
      </div>
      {children}
      <div className="flex"></div>
    </>
  );
};

export default VideoCall;
