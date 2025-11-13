// api/peerjs.js
import { ExpressPeerServer } from 'peer';

let peerServer;

export default function handler(req, res) {
  // Initialize PeerServer only once
  if (!peerServer) {
    peerServer = ExpressPeerServer(req.socket.server, {
      debug: true,
      path: '/peerjs',
      allow_discovery: true,
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
