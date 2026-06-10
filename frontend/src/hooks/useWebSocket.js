import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useWebSocket(roomCode, username, onFileCreated) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const fileSubscriptionRef = useRef(null);
  const activatedRef = useRef(false);

  useEffect(() => {
    if (!roomCode || !username || activatedRef.current) return;
    activatedRef.current = true;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS("https://paircode-q4k4.onrender.com/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        // Chat subscription
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        subscriptionRef.current = client.subscribe(
          `/topic/room/${roomCode}/chat`,
          (msg) => {
            const body = JSON.parse(msg.body);
            setMessages((prev) => [...prev, body]);
          },
        );

        // Presence subscription
        client.subscribe(`/topic/room/${roomCode}/presence`, (msg) => {
          const body = JSON.parse(msg.body);
          if (body.type === "USER_JOINED") {
            setOnlineUsers((prev) => {
              if (!prev.includes(body.username))
                return [...prev, body.username];
              return prev;
            });
          } else if (body.type === "USER_LEFT") {
            setOnlineUsers((prev) => prev.filter((u) => u !== body.username));
          }
        });

        setOnlineUsers((prev) => {
          if (!prev.includes(username)) return [...prev, username];
          return prev;
        });

        // File created subscription
        if (fileSubscriptionRef.current)
          fileSubscriptionRef.current.unsubscribe();
        fileSubscriptionRef.current = client.subscribe(
          `/topic/room/${roomCode}`,
          (msg) => {
            const body = JSON.parse(msg.body);
            if (body.type === "FILE_CREATED" && onFileCreated) {
              console.log("FILE_CREATED received!", body);
              onFileCreated(body);
            }
          },
        );

        // Announce join
        try {
          client.publish({
            destination: `/app/room/${roomCode}/presence`,
            body: JSON.stringify({ type: "JOIN" }),
          });
        } catch (e) {}
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("STOMP error", frame),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      activatedRef.current = false;
      if (clientRef.current) {
        try {
          clientRef.current.publish({
            destination: `/app/room/${roomCode}/presence`,
            body: JSON.stringify({ type: "LEAVE" }),
          });
        } catch (e) {}
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [roomCode, username]);

  const sendMessage = (content) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/room/${roomCode}/chat`,
        body: JSON.stringify({ content, type: "CHAT" }),
      });
    }
  };

  const sendFileCreated = (fileName, language) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/room/${roomCode}/file-created`,
        body: JSON.stringify({
          content: fileName,
          language,
          type: "FILE_CREATED",
        }),
      });
    }
  };

  return { messages, connected, sendMessage, sendFileCreated, onlineUsers };
}
