"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Stomp, CompatClient } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRouter } from "next/navigation";

export type Message = { usuario: string; mensagem: string; idSala: string };

type MessageReceived = Message & {
  date: Date;
};

type ChatProviderProps = {
  id: string;
};

type ChatContextProps = {
  chatMessages: MessageReceived[];
  sendMessage: (message: string) => void;
};

const ChatContext = createContext<ChatContextProps>({
  chatMessages: [],
  sendMessage(_message) {
    throw new Error("useChat must be used within a ToasterProvider");
  },
});

export const ChatProvider: React.FC<PropsWithChildren<ChatProviderProps>> = ({
  children,
  id,
}) => {
  const [stompClient, setStompClient] = useState<CompatClient>();

  const [chatMessages, setChatMessages] = useState<MessageReceived[]>([]);

  const [username, setUsername] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (!savedUsername) {
      return router.push("/");
    }
    setUsername(savedUsername);
  }, [router]);

  useEffect(() => {
    setStompClient(
      Stomp.over(
        () => new SockJS("https://streamchat-production.up.railway.app/chat")
      )
    );
  }, [username]);

  const onMessageReceived = useCallback(
    (payload: any) => {
      let message = JSON.parse(payload.body);
      setChatMessages((chatMessages) => [
        ...chatMessages,
        { ...message, date: new Date() },
      ]);
    },
    [setChatMessages]
  );

  useEffect(() => {
    if (stompClient && username) {
      stompClient.connect(
        {},
        (frame: any) => {
          stompClient.send(
            "/app/connect",
            {},
            JSON.stringify({ usuario: username, idSala: id })
          );

          stompClient.subscribe(`/chat/room/${id}`, onMessageReceived);
        },
        (error: Error) => {
          console.log(error);
        }
      );
    }

    return () => {
      stompClient?.disconnect();
    };
  }, [stompClient, id, onMessageReceived, username]);

  const sendMessage = useCallback(
    (message: string) => {
      if (stompClient) {
        stompClient.send(
          "/app/chat/message",
          {},
          JSON.stringify({ usuario: username, idSala: id, mensagem: message })
        );
      }
    },
    [stompClient, id, username]
  );

  const props = useMemo(
    () => ({
      chatMessages,
      sendMessage,
    }),
    [chatMessages, sendMessage]
  );
  return <ChatContext.Provider value={props}>{children}</ChatContext.Provider>;
};

export function useChat(): ChatContextProps {
  return useContext(ChatContext);
}
