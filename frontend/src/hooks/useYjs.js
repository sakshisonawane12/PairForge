import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'

export default function useYjs(roomCode, fileName, username, editorRef) {
    const [connected, setConnected] = useState(false)
    const [awarenessUsers, setAwarenessUsers] = useState([])
    const docRef = useRef(null)
    const providerRef = useRef(null)
    const bindingRef = useRef(null)

    useEffect(() => {
        if (!roomCode || !fileName || !editorRef?.current) {
            console.log('useYjs blocked:', { roomCode, fileName, hasEditor: !!editorRef?.current })
            return
        }

        const editor = editorRef.current
        const model = editor.getModel()

        if (!model) {
            console.log('useYjs: No model available yet')
            return
        }

        console.log('useYjs starting for:', roomCode, fileName)
        const docId = `${roomCode}-${fileName}`

        // Cleanup previous
        bindingRef.current?.destroy()
        providerRef.current?.destroy()
        docRef.current?.destroy()
        bindingRef.current = null
        providerRef.current = null
        docRef.current = null

        // Create Yjs document
        const ydoc = new Y.Doc()
        docRef.current = ydoc

        // Connect to Yjs server
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = "wss://paircode-yjs.onrender.com"`

        const provider = new WebsocketProvider(wsUrl, docId, ydoc)
        providerRef.current = provider

        provider.on('status', ({ status }) => {
            console.log('Yjs status:', status)
            setConnected(status === 'connected')
        })

        provider.on('sync', (isSynced) => {
            console.log('Yjs synced:', isSynced)
        })

        // Assign color based on username
        const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
        const colorIndex = Math.abs(
            username.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
        ) % colors.length

        const awareness = provider.awareness

        awareness.setLocalStateField('user', {
            name: username,
            color: colors[colorIndex]
        })

        const updateUsers = () => {
            const users = []
            awareness.getStates().forEach((state) => {
                if (state.user) users.push(state.user)
            })
            setAwarenessUsers(users)
        }

        awareness.on('update', updateUsers)
        updateUsers()

        // Bind Yjs to Monaco
        const yText = ydoc.getText('content')
        bindingRef.current = new MonacoBinding(
            yText,
            model,
            new Set([editor]),
            awareness
        )
        console.log('MonacoBinding created for:', fileName)
        console.log('MonacoBinding created for:', fileName, 'model:', model.id)
        return () => {
            console.log('Cleaning up Yjs for:', fileName)
            bindingRef.current?.destroy()
            providerRef.current?.destroy()
            docRef.current?.destroy()
            bindingRef.current = null
            providerRef.current = null
            docRef.current = null
        }
    }, [roomCode, fileName, username, editorRef?.current])

    return { connected, awarenessUsers }
}