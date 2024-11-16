import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateTodoDto,
  DeleteTodoDto,
  GetAllTodosDto,
} from '@libs/dtos/todo.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoClientService {
  private readonly logger = new Logger(TodoClientService.name);
  constructor(
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
  ) {}

  async createTodo(newtodo: CreateTodoDto) {
    try {
      const pattern = { cmd: 'create_todo' };
      return firstValueFrom(this.todoClient.send(pattern, newtodo));
    } catch (error) {
      this.logger.error(`Failed to create todo`, error.stack);
      throw new Error(error);
    }
  }

  async deleteTodo(todo: DeleteTodoDto) {
    try {
      const pattern = { cmd: 'delete_todo' };
      return firstValueFrom(this.todoClient.send(pattern, todo));
    } catch (error) {
      this.logger.error(`Failed to delete todo`, error.stack);
      throw new Error(error);
    }
  }

  async getAllTodos(infotodo: GetAllTodosDto) {
    try {
      const pattern = { cmd: 'get_all_todos' };
      return firstValueFrom(this.todoClient.send(pattern, infotodo));
    } catch (error) {
      this.logger.error(`Failed to retrieve todos`, error.stack);
      throw new Error(error);
    }
  }
}
