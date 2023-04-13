"use client";

import { useEffect, useRef, useState } from "react";

import { Peer } from "peerjs";

type VideoCallProps = {
  id: string;
};

const VideoCall = ({ id }: VideoCallProps) => {
  const localAudioRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window) {
      const me = localStorage.getItem("username");
      const peer = new Peer(`streamchat-${id}-${me}`);
      if (me !== "renan") {
        console.log("aqui não papai");
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localAudioRef.current!.srcObject = stream;
            const call = peer.call(`streamchat-${id}-renan`, stream);
            call.on("stream", (remoteStream) => {
              remoteAudioRef.current!.srcObject = remoteStream;
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      }
      peer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localAudioRef.current!.srcObject = stream;
            call.answer(stream); // Answer the call with an A/V stream.
            call.on("stream", (remoteStream) => {
              // Show stream in some <video> element.
              remoteAudioRef.current!.srcObject = remoteStream;
            });
          })
          .catch((err) => {
            console.error("Failed to get local stream", err);
          });
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-4">
      <video
        ref={localAudioRef}
        className="border border-white"
        playsInline
        autoPlay
        muted
      />
      <video
        ref={remoteAudioRef}
        className="border border-white"
        playsInline
        autoPlay
      />
    </div>
  );
};

export default VideoCall;
