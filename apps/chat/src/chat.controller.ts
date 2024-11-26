import { Controller, Logger, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';
import { ChatService } from './chat.service';
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Controller()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  port: 3000,
  namespace: '/',
  transports: ['websocket', 'polling']
})
export class ChatController {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @MessagePattern({ cmd: 'sendMessage' })
  async sendMessage(messageData: {
    content: string;
    roomId: string;
    senderId: string;
    tenantId: string;
  }): Promise<ResponseDto> {
    try {
      const result : any = await this.chatService.createMessage(messageData);
      if (result.errorMessage) {
        return result;
      }
      // Emitir el mensaje a través de WebSocket si fue exitoso
      this.server.to(messageData.roomId).emit('newMessage', result);
      return {
        status: HttpStatus.OK,
        data: result,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error('Error sending message:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'getRoomMessages' })
  async getRoomMessages(data: { roomId: string; tenantId: string }): Promise<ResponseDto> {
    try {
      const messages : any = await this.chatService.getRoomMessages(data);
      console.log(messages);
      if (messages.errorMessage) {
        return messages;
      }
      return {
        status: HttpStatus.OK,
        data: messages,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error('Error retrieving messages:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; tenantId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    const messages = await this.chatService.getRoomMessages(data);
    client.emit('previousMessages', messages);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
  }
}