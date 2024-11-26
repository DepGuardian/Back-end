import {
    Controller,
    Logger,
    Post,
    Body,
    Get,
    Query,
    HttpException,
    HttpStatus,
    Res,
  } from '@nestjs/common';
  import { ResponseDto } from '@libs/dtos/response.dto';
  import { ChatClientService } from './chat-client.service';
  
  @Controller('chat')
  export class ChatClientController {
    private readonly logger = new Logger(ChatClientController.name);
  
    constructor(private readonly chatClientService: ChatClientService) {}
  
    @Post('message')
    async sendMessage(
      @Body() messageData: { content: string; roomId: string; senderId: string; tenantId: string },
      @Res() res: any,
    ) {
      try {
        this.logger.log(
          `Sending message in room ${messageData.roomId} for tenant ${messageData.tenantId}`,
          `POST /chat/message`,
        );
        const response: ResponseDto = await this.chatClientService.sendMessage(messageData);
        return res.status(response.status).json(response);
      } catch (error) {
        this.logger.error(`Failed to send message`, error.stack);
        throw new HttpException(
          'Failed to send message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Get('messages')
    async getRoomMessages(
      @Query('roomId') roomId: string,
      @Query('tenantId') tenantId: string,
      @Res() res: any,
    ) {
      try {
        this.logger.log(
          `Getting messages for room ${roomId} and tenant ${tenantId}`,
          `GET /chat/messages`,
        );
        const response: ResponseDto = await this.chatClientService.getRoomMessages({ roomId, tenantId });
        console.log(response);
        return res.status(response.status).json(response);
      } catch (error) {
        this.logger.error(`Failed to retrieve messages`, error.stack);
        throw new HttpException(
          'Failed to retrieve messages',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  