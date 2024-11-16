import { Controller, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateTodoDto,
  DeleteTodoDto,
  GetAllTodosDto,
} from '@libs/dtos/todo.dto';
import { ResponseDto } from '@libs/dtos/response.dto';
import { TypeErrors } from '@libs/constants/errors';
import { TodoService } from './todo.service';

@Controller()
export class TodoController {
  private readonly logger = new Logger(TodoController.name);
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'create_todo' })
  async createTodo(newtodo: CreateTodoDto) {
    try {
      const response: ResponseDto = await this.todoService.createTodo(newtodo);
      return response;
    } catch (error) {
      this.logger.error('Error creating todo:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'delete_todo' })
  async deleteTodo(todo: DeleteTodoDto) {
    try {
      const response: ResponseDto = await this.todoService.deleteTodo(todo);
      return response;
    } catch (error) {
      this.logger.error('Error deleting todo:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @MessagePattern({ cmd: 'get_all_todos' })
  async getAllTodos(infotodo: GetAllTodosDto) {
    try {
      const response: ResponseDto =
        await this.todoService.getAllTodos(infotodo);
      return response;
    } catch (error) {
      this.logger.error('Error fetching todos:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
