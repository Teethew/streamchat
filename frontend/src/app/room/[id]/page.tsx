"use client";

import Voip from "@/components/voip";
import { ChatProvider, useChat } from "@/context/chat";
import { useRef } from "react";

const RoomComponent = () => {
  const { chatMessages, sendMessage } = useChat();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const me = localStorage.getItem("username");

  return (
    <main className="container mx-auto flex-grow flex flex-col p-8 gap-3">
      <div className="flex-grow border-2 border-primary rounded-xl p-3 overflow-auto">
        {chatMessages.map(({ mensagem, usuario, date }, index) => (
          <div key={index} className="flex items-center gap-3 my-4">
            <div
              className="flex justify-center items-center rounded-full"
              style={{
                order: usuario === me ? 1 : 0,
                width: "40px",
                height: "40px",
                minHeight: "40px",
                minWidth: "40px",
                backgroundColor: `rgb(${
                  Math.round(usuario.length * 40) % 255
                },${Math.round(usuario.length * 22) % 255},${
                  Math.round(usuario.length * 35) % 255
                })`,
              }}
            >
              {usuario[0].toUpperCase()}
            </div>
            <div className="p-3 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex-grow">
              <p>{mensagem}</p>
              {usuario !== me && (
                <p className="text-xs text-end">
                  Recebido às {date.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex flex-col gap-3 relative"
        onSubmit={(event) => {
          event.preventDefault();
          if (textAreaRef.current) {
            sendMessage(textAreaRef.current.value);
            textAreaRef.current.value = "";
          }
        }}
      >
        <textarea
          ref={textAreaRef}
          rows={4}
          className="rounded-lg border-2 border-primary focus:ring-primary focus:ring-2 bg-gray-50 text-black focus: px-4 py-2 w-full resize-none pr-[50px]"
        />
        {me && (
          <div
            className="absolute right-1 top-1 flex justify-center items-center rounded-full"
            style={{
              width: "40px",
              height: "40px",
              minHeight: "40px",
              minWidth: "40px",
              backgroundColor: `rgb(${Math.round(me.length * 40) % 255},${
                Math.round(me.length * 22) % 255
              },${Math.round(me.length * 35) % 255})`,
            }}
          >
            {me[0].toUpperCase()}
          </div>
        )}
        <button
          type="submit"
          className="flex justify-center items-center absolute right-1 bottom-1 hover:bg-gradient-to-br focus:ring-1 focus:ring-secondary bg-gradient-to-tr from-primary to-secondary w-10 h-10 rounded-full cursor-pointer"
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
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11"></path>
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        </button>
      </form>
    </main>
  );
};

export default function Room({ params: { id } }: { params: { id: string } }) {
  return (
    <ChatProvider id={id}>
      <RoomComponent />
      <Voip id={id} />
    </ChatProvider>
  );
}
