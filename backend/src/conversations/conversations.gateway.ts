// import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
// export class ConversationsGateway {
//   @WebSocketServer()
//   server: Server;

//   emitConversationCreated(conversation: any) {
//     this.server.emit('conversation:new', conversation);
//   }

//   emitMessageCreated(message: any) {
//     this.server.emit('message:new', message);
//   }

//   handleConnection(client: any) {
//   console.log('Socket connected:', client.id);
// }

// }


import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  },
})
export class ConversationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('🟢 Socket connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Socket disconnected:', client.id);
  }

  /** Emit when new message is created */
  emitMessageCreated(message: any) {
    this.server.emit('message:new', message);
  }

  emitConversationCreated(conversation: any) {
    this.server.emit('conversation:new', conversation);}
}
