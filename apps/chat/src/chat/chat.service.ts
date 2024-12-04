import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DatabaseConnectionService } from '../../../../libs/database/database.service';
import { Message, MessageSchema } from '../../../../libs/schemas/chat.schema';
import { TypeErrors } from '../../../../libs/constants/errors';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async createMessage(data: {
    content: string;
    roomId: string;
    senderId: string;
    tenantId: string;
  }) {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(data.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const MessageModel = tenantConnection.model<Message>(
        'Message',
        MessageSchema,
      );

      const message = new MessageModel(data);
      const savedMessage = await message.save();
      return savedMessage;
    } catch (error) {
      this.logger.error('Error creating message:', error);
      throw error;
    }
  }

  async getRoomMessages(data: { roomId: string; tenantId: string }) {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(data.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const MessageModel = tenantConnection.model<Message>(
        'Message',
        MessageSchema,
      );

      return MessageModel.find({ roomId: data.roomId })
        .sort({ createdAt: 1 })
        .limit(50)
        .exec();
    } catch (error) {
      this.logger.error('Error retrieving messages:', error);
      throw error;
    }
  }
}
