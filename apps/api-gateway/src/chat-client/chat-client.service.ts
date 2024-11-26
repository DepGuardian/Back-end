import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatClientService {
  private readonly logger = new Logger(ChatClientService.name);

  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  async sendMessage(messageData: {
    content: string;
    roomId: string;
    senderId: string;
    tenantId: string;
  }) {
    try {
      const pattern = { cmd: 'sendMessage' };
      return firstValueFrom(this.chatClient.send(pattern, messageData));
    } catch (error) {
      this.logger.error(`Failed to send message`, error.stack);
      throw new Error(error);
    }
  }

  async getRoomMessages(data: { roomId: string; tenantId: string }) {
    try {
      const pattern = { cmd: 'getRoomMessages' };
      return firstValueFrom(this.chatClient.send(pattern, data));
    } catch (error) {
      this.logger.error(`Failed to retrieve messages`, error.stack);
      throw new Error(error);
    }
  }
}