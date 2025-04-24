import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MessageService } from './message.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })
  export class MessageGateway {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly messageService: MessageService) {}
  
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @MessageBody()
      body: {
        sender_id: number;
        receiver_id: number;
        content: string;
      },
      @ConnectedSocket() client: Socket,
    ) {
    console.log('Received message:', body);
    
      const message = await this.messageService.create(body);
      
      this.server.to(`user_${body.receiver_id}`).emit('receiveMessage', message);
      this.server.to(`user_${body.sender_id}`).emit('receiveMessage', message);
  
      return message;
    }
  
    handleConnection(client: Socket) {
      const userId = client.handshake.query.userId;
      if (userId) {
        client.join(`user_${userId}`);
        console.log(`User ${userId} connected to socket`);
      }
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected');
    }
  }
  