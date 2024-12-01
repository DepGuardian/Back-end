import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  namespace: '/',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client attempting connection: ${client.id}`);
    try {
      const tenantId = client.handshake.query.tenantId as string;
      const userId = client.handshake.query.userId as string;

      if (!tenantId || !userId) {
        this.logger.error(`Missing credentials for client ${client.id}`);
        client.disconnect();
        return;
      }

      await client.join(`tenant:${tenantId}`);
      this.logger.log(`Client connected: ${client.id} for tenant: ${tenantId}`);
      client.emit('connectionEstablished', {
        status: 'connected',
        userId,
        tenantId,
      });
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; tenantId: string },
  ) {
    this.logger.log(`Client ${client.id} joining room ${data.roomId}`);
    try {
      await client.join(data.roomId);
      const messages = await this.chatService.getRoomMessages(data);
      return messages;
    } catch (error) {
      this.logger.error(`Error joining room: ${error.message}`);
      return { error: 'Failed to join room' };
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      content: string;
      roomId: string;
      senderId: string;
      tenantId: string;
    },
  ) {
    this.logger.log(`Message from client ${client.id} in room ${data.roomId}`);
    try {
      const savedMessage = await this.chatService.createMessage(data);
      this.server.to(data.roomId).emit('newMessage', savedMessage);
      return savedMessage;
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`);
      client.emit('error', { message: 'Failed to send message' });
      return { error: 'Failed to send message' };
    }
  }
}
