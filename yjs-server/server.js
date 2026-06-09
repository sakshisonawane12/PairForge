const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')
const Y = require('yjs')

// Store Yjs docs in memory
const docs = new Map()

// Get or create a doc for a room
function getDoc(docName) {
    if (!docs.has(docName)) {
        const ydoc = new Y.Doc()
        docs.set(docName, ydoc)
        console.log(`Created new doc: ${docName}`)
    }
    return docs.get(docName)
}

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Yjs WebSocket Server running\n' + `Active docs: ${docs.size}`)
})

const wss = new WebSocket.Server({ server, perMessageDeflate: false })

wss.on('connection', (conn, req) => {
    console.log(`New WebSocket connection from ${req.socket.remoteAddress}`)
    setupWSConnection(conn, req)
})

wss.on('error', (error) => {
    console.error('WebSocket Server error:', error)
})

process.on('SIGINT', () => {
    console.log('Shutting down Yjs server...')
    docs.clear()
    server.close(() => {
        console.log('Yjs server closed')
        process.exit(0)
    })
})

server.listen(1234, '0.0.0.0', () => {
    console.log('✅ Yjs server running on ws://0.0.0.0:1234')
    console.log('Waiting for connections...')
})