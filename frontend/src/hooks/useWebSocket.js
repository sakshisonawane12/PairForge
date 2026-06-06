import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function useWebSocket(roomCode, username, onRemoteCodeChange) {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const codeSubscriptionRef = useRef(null);
    const activatedRef = useRef(false);
    const isRemoteChange = useRef(false);

    useEffect(() => {
        if (!roomCode || !username || activatedRef.current) return;
        activatedRef.current = true;

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            onConnect: () => {
                setConnected(true);

                // Subscribe to chat
                if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
                subscriptionRef.current = client.subscribe(
                    `/topic/room/${roomCode}/chat`,
                    (msg) => {
                        const body = JSON.parse(msg.body);
                        setMessages((prev) => [...prev, body]);
                    }
                );

                // Subscribe to code changes
                if (codeSubscriptionRef.current) codeSubscriptionRef.current.unsubscribe();
                codeSubscriptionRef.current = client.subscribe(
                    `/topic/room/${roomCode}`,
                    (msg) => {
                        const body = JSON.parse(msg.body);
                        if (body.type === 'CODE_CHANGE' && onRemoteCodeChange) {
                            isRemoteChange.current = true;
                            onRemoteCodeChange(body.content);
                        }
                    }
                );

                // Announce join
                try {
                    client.publish({
                        destination: `/app/room/${roomCode}/presence`,
                        body: JSON.stringify({ type: 'JOIN' }),
                    });
                } catch (e) {}
            },
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error('STOMP error', frame),
        });

        client.activate();
        clientRef.current = client;

        return () => {
            activatedRef.current = false;
            if (clientRef.current) {
                try {
                    clientRef.current.publish({
                        destination: `/app/room/${roomCode}/presence`,
                        body: JSON.stringify({ type: 'LEAVE' }),
                    });
                } catch (e) {}
                clientRef.current.deactivate();
            }
        };
    }, [roomCode, username]);

    const sendMessage = (content) => {
        if (clientRef.current && connected) {
            clientRef.current.publish({
                destination: `/app/room/${roomCode}/chat`,
                body: JSON.stringify({ content, type: 'CHAT' }),
            });
        }
    };

    const sendCodeChange = (content) => {
        if (clientRef.current && connected && !isRemoteChange.current) {
            clientRef.current.publish({
                destination: `/app/room/${roomCode}/code`,
                body: JSON.stringify({ content, type: 'CODE_CHANGE' }),
            });
        }
        isRemoteChange.current = false;
    };

    return { messages, connected, sendMessage, sendCodeChange };
}