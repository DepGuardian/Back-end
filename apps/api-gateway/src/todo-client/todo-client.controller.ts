import { Controller, Logger, Get, Query, Body, Post } from '@nestjs/common';
import { CreateTodoDto, DeleteTodoDto, GetAllTodosDto } from '../../../../libs/dtos/todo.dto';
import { TodoClientService } from './todo-client.service';
import { Types } from 'mongoose';

@Controller('todo')
export class TodoClientController {
  private readonly logger = new Logger(TodoClientController.name);

  constructor(private readonly todoClientService: TodoClientService) {}

  @Post('create')
  async createTodo(@Body() newtodo: CreateTodoDto) {
    try {
      this.logger.debug(
        `Attempting to create todo for tenant: ${newtodo.tenantId}`,
      );
      const response = await this.todoClientService.createTodo(newtodo);
      this.logger.debug(`Todo created successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to create todo`, error.stack);
      throw error;
    }
  }

  @Post('delete')
  async deleteTodo(@Body() todo: DeleteTodoDto) {
    try {
      this.logger.debug(
        `Attempting to delete todo for tenant: ${todo.tenantId}`,
      );
      const response = await this.todoClientService.deleteTodo(todo);
      this.logger.debug(`Todo deleted successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to delete todo`, error.stack);
      throw error;
    }
  }

  @Get('all')
  async getAllTodos(@Query('tenantId') tenantId: string, @Query('residentId') residentId: Types.ObjectId) {
    try {
      this.logger.debug(
        `Attempting to get all todos for tenant: ${tenantId}`,
      );
      const response = await this.todoClientService.getAllTodos({ tenantId, residentId });
      this.logger.debug(`Todos retrieved successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to retrieve todos`, error.stack);
      throw error;
    }
  }
}
