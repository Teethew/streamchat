"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

import { Peer } from "peerjs";
import { error } from "console";

type VideoCallProps = {
  id: string;
};

const VideoCall = ({ id, children }: PropsWithChildren<VideoCallProps>) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const peer = new Peer(
      `streamchat-${id}-${localStorage.getItem("username")}`
    );
    console.log("peer", peer);
    peer.on("call", (call) => {
      console.log(call);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("stream", stream);
          localVideoRef.current!.srcObject = stream;
          console.log(call);
          call.on("stream", (remoteStream) => {
            console.log("remoteStream", remoteStream);
            remoteVideoRef.current!.srcObject = remoteStream;
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    });
    if (localStorage.getItem("username") != "renan") {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("stream", stream);
          localVideoRef.current!.srcObject = stream;
          const call = peer.call(`streamchat-${id}-renan`, stream);
          call.on("stream", (remoteStream) => {
            console.log("remoteStream", remoteStream);
            remoteVideoRef.current!.srcObject = remoteStream;
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    }
  }, []);

  const handleCallPerson = () => {};

  return (
    <>
      <div className="grid grid-cols-4">
        <video
          ref={localVideoRef}
          className="border border-white"
          playsInline
          autoPlay
          muted
        />
        <video
          ref={remoteVideoRef}
          className="border border-white"
          playsInline
          autoPlay
        />
      </div>
      {children}
      <div className="flex">
        <button
          type="button"
          className="flex justify-center items-center hover:bg-gradient-to-br focus:ring-1 focus:ring-secondary bg-gradient-to-tr from-primary to-secondary w-10 h-10 rounded-full cursor-pointer"
          onClick={handleCallPerson}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
            <path d="M15 7a2 2 0 0 1 2 2"></path>
            <path d="M15 3a6 6 0 0 1 6 6"></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default VideoCall;
