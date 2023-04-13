"use client";

import { useEffect, useRef, useState } from "react";

// const Voip = () => {
//   const localAudioRef = useRef<HTMLAudioElement>(null);
//   const remoteAudioRef = useRef<HTMLAudioElement>(null);

//   const signaling = useRef(new BroadcastChannel("webrtc"));
//   const localStream = useRef<MediaStream | null>(null);

//   const pc = useRef<RTCPeerConnection | null>(null);

//   const [onCall, setOnCall] = useState(false);

//   useEffect(() => {
//     function createPeerConnection() {
//       pc.current = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: "stun:a.relay.metered.ca:80",
//           },
//           {
//             urls: "turn:a.relay.metered.ca:80",
//             username: "a0f8b7ca844daf079e7e3036",
//             credential: "Q94lDFFQW1yw5qEc",
//           },
//           {
//             urls: "turn:a.relay.metered.ca:443",
//             username: "a0f8b7ca844daf079e7e3036",
//             credential: "Q94lDFFQW1yw5qEc",
//           },
//           {
//             urls: "turn:a.relay.metered.ca:443?transport=tcp",
//             username: "a0f8b7ca844daf079e7e3036",
//             credential: "Q94lDFFQW1yw5qEc",
//           },
//         ],
//       });
//       if (!localStream.current || !pc.current) return;
//       pc.current.onicecandidate = ({ candidate }) => {
//         const message = {
//           type: "candidate",
//           candidate: candidate?.candidate ?? null,
//           sdpMid: candidate?.sdpMid ?? null,
//           sdpMLineIndex: candidate?.sdpMLineIndex ?? null,
//         };
//         signaling.current.postMessage(message);
//       };
//       pc.current.ontrack = (e) => {
//         if (remoteAudioRef.current) {
//           remoteAudioRef.current.srcObject = e.streams[0];
//         }
//       };
//       localStream.current
//         .getTracks()
//         .forEach(
//           (track) =>
//             localStream.current &&
//             pc.current?.addTrack(track, localStream.current)
//         );
//     }

//     async function makeCall() {
//       await createPeerConnection();
//       if (!pc.current) return;

//       const offer = await pc.current.createOffer();
//       signaling.current.postMessage({ type: "offer", sdp: offer.sdp });
//       await pc.current.setLocalDescription(offer);
//     }

//     async function handleOffer(offer: RTCSessionDescriptionInit) {
//       await createPeerConnection();
//       if (!pc.current) return;

//       await pc.current.setRemoteDescription(offer);

//       const answer = await pc.current.createAnswer();
//       signaling.current.postMessage({ type: "answer", sdp: answer.sdp });
//       await pc.current.setLocalDescription(answer);
//     }

//     async function handleAnswer(answer: RTCSessionDescriptionInit) {
//       if (!pc.current) {
//         console.error("no peerconnection");
//         return;
//       }
//       await pc.current.setRemoteDescription(answer);
//     }

//     async function handleCandidate(candidate: RTCIceCandidateInit) {
//       if (!pc.current) {
//         console.error("no peerconnection");
//         return;
//       }
//       if (!candidate.candidate) {
//         await pc.current.addIceCandidate(undefined);
//       } else {
//         await pc.current.addIceCandidate(candidate);
//       }
//     }
//     signaling.current.onmessage = (e) => {
//       if (!localStream.current) {
//         console.log("not ready yet");
//         return;
//       }
//       switch (e.data.type) {
//         case "offer":
//           handleOffer(e.data);
//           break;
//         case "answer":
//           handleAnswer(e.data);
//           break;
//         case "candidate":
//           handleCandidate(e.data);
//           break;
//         case "ready":
//           if (pc.current) {
//             console.log("already in call, ignoring");
//             return;
//           }
//           makeCall();
//           break;
//         case "bye":
//           if (pc) {
//             hangup();
//           }
//           break;
//         default:
//           console.log("unhandled", e);
//           break;
//       }
//     };
//   }, []);

//   const handleMakeCall = async () => {
//     localStream.current = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: false,
//     });
//     localAudioRef.current!.srcObject = localStream.current;

//     setOnCall(true);

//     signaling.current.postMessage({ type: "ready" });
//   };

//   const hangup = async () => {
//     if (!localStream.current) return;
//     if (pc.current) {
//       pc.current.close();
//       pc.current = null;
//     }
//     localStream.current.getTracks().forEach((track) => track.stop());
//     localStream.current = null;
//     setOnCall(false);
//   };

//   return (
//     <>
//       <audio
//         ref={localAudioRef}
//         className="border border-white"
//         playsInline
//         autoPlay
//         muted
//       />
//       <audio
//         ref={remoteAudioRef}
//         className="border border-white"
//         playsInline
//         autoPlay
//       />
//       <button disabled={onCall} onClick={handleMakeCall}>
//         Start
//       </button>
//       <button disabled={!onCall} onClick={hangup}>
//         Hang Up
//       </button>
//     </>
//   );
// };

import { Peer } from "peerjs";

type VoipProps = {
  id: string;
};

const Voip = ({ id }: VoipProps) => {
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
    <div>
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

export default Voip;
