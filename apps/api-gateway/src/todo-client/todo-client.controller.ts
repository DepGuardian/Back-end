import {
  Controller,
  Logger,
  Get,
  Query,
  Body,
  Post,
  Delete,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTodoDto, DeleteTodoDto } from '@libs/dtos/todo.dto';
import { TodoClientService } from './todo-client.service';
import { Types } from 'mongoose';
import { ResponseDto } from '@libs/dtos/response.dto';

@Controller('todo')
export class TodoClientController {
  private readonly logger = new Logger(TodoClientController.name);

  constructor(private readonly todoClientService: TodoClientService) {}

  @Post()
  async createTodo(@Body() newtodo: CreateTodoDto, @Res() res: any) {
    try {
      this.logger.log(
        `Create TODO for TenantId ${newtodo.tenantId}`,
        `POST /todo`,
      );
      const response: ResponseDto =
        await this.todoClientService.createTodo(newtodo);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Failed to create todo`, error.stack);
      throw new HttpException(
        'Failed to create todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete()
  async deleteTodo(@Body() todo: DeleteTodoDto, @Res() res: any) {
    try {
      this.logger.log(
        `Delete TODO for TenantId ${todo.tenantId}`,
        `DELETE /todo`,
      );
      const response: ResponseDto =
        await this.todoClientService.deleteTodo(todo);
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Failed to delete todo`, error.stack);
      throw new HttpException(
        'Failed to delete todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllTodos(
    @Query('tenantId') tenantId: string,
    @Query('residentId') residentId: Types.ObjectId,
    @Res() res: any,
  ) {
    try {
      this.logger.log(
        `Get all todos for TenantId ${tenantId}`,
        `GET /todo?tenantId=${tenantId}&residentId=${residentId}`,
      );
      const response: ResponseDto = await this.todoClientService.getAllTodos({
        tenantId,
        residentId,
      });
      return res.status(response.status).json(response);
    } catch (error) {
      this.logger.error(`Failed to retrieve todos`, error.stack);
      throw new HttpException(
        'Failed to retrieve todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
