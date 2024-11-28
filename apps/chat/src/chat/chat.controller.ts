import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(
    @Query('roomId') roomId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.chatService.getRoomMessages({ roomId, tenantId });
  }

  @Post('messages')
  async createMessage(
    @Body()
    data: {
      content: string;
      roomId: string;
      senderId: string;
      tenantId: string;
    },
  ) {
    return this.chatService.createMessage(data);
  }
}