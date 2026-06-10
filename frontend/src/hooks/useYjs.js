import { useEffect, useRef, useState, useCallback } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

export default function useYjs(roomCode, fileName, username, editorRef) {
  const [connected, setConnected] = useState(false);
  const [awarenessUsers, setAwarenessUsers] = useState([]);
  const [sharedLanguage, setSharedLanguage] = useState(null);
  const docRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (!roomCode || !fileName || !editorRef?.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    const docId = `${roomCode}-${fileName}`;

    bindingRef.current?.destroy();
    providerRef.current?.destroy();
    docRef.current?.destroy();
    bindingRef.current = null;
    providerRef.current = null;
    docRef.current = null;

    const ydoc = new Y.Doc();
    docRef.current = ydoc;

    const wsUrl = "wss://paircode-yjs.onrender.com";
    const provider = new WebsocketProvider(wsUrl, docId, ydoc);
    providerRef.current = provider;

    provider.on("status", ({ status }) => setConnected(status === "connected"));

    // Shared language map — synced across all users via Yjs
    const yMeta = ydoc.getMap("meta");
    yMeta.observe(() => {
      const lang = yMeta.get("language");
      if (lang) setSharedLanguage(lang);
    });

    // Assign color based on username
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
    const colorIndex =
      Math.abs(username.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
      colors.length;
    const color = colors[colorIndex];

    const awareness = provider.awareness;
    awareness.setLocalStateField("user", {
      name: username,
      color,
      colorLight: color + "33",
    });

    // Inject cursor CSS with username label
    const styleId = `yjs-cursor-${username}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .yRemoteSelection-${colorIndex} { background-color: ${color}33; }
        .yRemoteSelectionHead-${colorIndex} {
          border-left: 2px solid ${color};
          border-top: 2px solid ${color};
          position: relative;
        }
        .yRemoteSelectionHead-${colorIndex}::after {
          content: "${username}";
          background: ${color};
          color: #fff;
          font-size: 10px;
          font-family: monospace;
          padding: 1px 4px;
          border-radius: 2px;
          position: absolute;
          top: -18px;
          left: 0;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
        }
      `;
      document.head.appendChild(style);
    }

    const updateUsers = () => {
      const users = [];
      awareness.getStates().forEach((state) => {
        if (state.user) users.push(state.user);
      });
      setAwarenessUsers(users);
    };
    awareness.on("update", updateUsers);
    updateUsers();

    const yText = ydoc.getText("content");
    bindingRef.current = new MonacoBinding(yText, model, new Set([editor]), awareness);

    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      docRef.current?.destroy();
      bindingRef.current = null;
      providerRef.current = null;
      docRef.current = null;
    };
  }, [roomCode, fileName, username, editorRef?.current]);

  const setLanguage = useCallback((lang) => {
    const yMeta = docRef.current?.getMap("meta");
    if (yMeta) yMeta.set("language", lang);
  }, []);

  return { connected, awarenessUsers, sharedLanguage, setLanguage };
}
