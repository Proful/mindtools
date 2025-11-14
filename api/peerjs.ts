// api/peerjs.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ExpressPeerServer } from 'peer';
import type { Server } from 'http';

let peerServer: ReturnType<typeof ExpressPeerServer> | null = null;

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize PeerServer only once
  if (!peerServer) {
    // Create a mock HTTP server for PeerJS
    const server = req.socket?.server as Server;
    
    if (!server) {
      res.status(500).json({ error: 'Server not available' });
      return;
    }

    peerServer = ExpressPeerServer(server, {
      debug: true,
      path: '/peerjs',
      allow_discovery: true,
      proxied: true,
      generateClientId: () => {
        // Generate random ID for clients
        return Math.random().toString(36).substring(2, 15);
      }
    });

    // Handle PeerServer events
    peerServer.on('connection', (client) => {
      console.log('Client connected:', client.getId());
    });

    peerServer.on('disconnect', (client) => {
      console.log('Client disconnected:', client.getId());
    });
  }

  // Handle the request
  return peerServer(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
