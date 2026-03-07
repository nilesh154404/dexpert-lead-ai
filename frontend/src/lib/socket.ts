import { io } from 'socket.io-client';

export const socket = io('https://lead-ai-backend.dexpertsystems.com', {
  transports: ['websocket'],
});
