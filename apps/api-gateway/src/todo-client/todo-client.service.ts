import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTodoDto, DeleteTodoDto, GetAllTodosDto } from '../../../../libs/dtos/todo.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TodoClientService {
  constructor(
    @Inject('TODO_SERVICE') private readonly todoClient: ClientProxy,
  ) {}

  async createTodo(newtodo: CreateTodoDto) {
    try {
      const pattern = { cmd: 'create_todo' };
      return firstValueFrom(this.todoClient.send(pattern, { newtodo }));
    } catch (error) {
      throw error;
    }
  }

  async deleteTodo(todo: DeleteTodoDto) {
    try {
      const pattern = { cmd: 'delete_todo' };
      return firstValueFrom(this.todoClient.send(pattern, { todo }));
    } catch (error) {
      throw error;
    }
  }

  async getAllTodos(infotodo: GetAllTodosDto) {
    try {
      const pattern = { cmd: 'get_all_todos' };
      return firstValueFrom(this.todoClient.send(pattern, { infotodo }));
    } catch (error) {
      throw error;
    }
  }
}
