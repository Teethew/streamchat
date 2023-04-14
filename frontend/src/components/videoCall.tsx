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
            call.on("stream", (remoteStream) => {
              if (!remoteVideosRef.current) return;
              setStreams((prevStreams) => [
                ...prevStreams.filter((it) => it.id !== remoteStream.id),
                remoteStream,
              ]);
              call.on("iceStateChanged", (event) => {
                if (event === "disconnected") {
                  setStreams((prevStreams) =>
                    prevStreams.filter((it) => it.id !== remoteStream.id)
                  );
                }
              });
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

              for (const user of otherUsers) {
                const call = peer.call(`streamchat-${id}-${user}`, stream);
                call.on("stream", (remoteStream) => {
                  if (!remoteVideosRef.current) return;
                  setStreams((prevStreams) => [
                    ...prevStreams.filter((it) => it.id !== remoteStream.id),
                    remoteStream,
                  ]);
                  call.on("iceStateChanged", (event) => {
                    if (event === "disconnected") {
                      setStreams((prevStreams) =>
                        prevStreams.filter((it) => it.id !== remoteStream.id)
                      );
                    }
                  });
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
        {streams.map(
          (stream, index) =>
            stream.active && (
              <video
                key={index}
                className="border border-white"
                playsInline
                autoPlay
                onAbort={() => {
                  console.log("onAbort");
                }}
                onAbortCapture={() => {
                  console.log("onAbortCapture");
                }}
                onPause={() => {
                  console.log("onPause");
                }}
                onEnded={() => {
                  console.log("onEnded");
                }}
                onEndedCapture={() => {
                  console.log("onEndedCapture");
                }}
                onWaiting={() => {
                  console.log("onWaiting");
                }}
                onWaitingCapture={() => {
                  console.log("onWaitingCapture");
                }}
                onError={() => {
                  console.log("onError");
                }}
                onErrorCapture={() => {
                  console.log("onErrorCapture");
                }}
                onStalled={() => {
                  console.log("onStalled");
                }}
                onStalledCapture={() => {
                  console.log("onStalledCapture");
                }}
                onSuspend={() => {
                  console.log("onSuspend");
                }}
                onSuspendCapture={() => {
                  console.log("onSuspendCapture");
                }}
                onWheel={() => {
                  console.log("onWheel");
                }}
              />
            )
        )}
      </div>
      {children}
      <div className="flex"></div>
    </>
  );
};

export default VideoCall;
