import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateTodoDto,
  DeleteTodoDto,
  GetAllTodosDto,
} from '../../../libs/dtos/todo.dto';
import { TodoService } from './todo.service';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @MessagePattern({ cmd: 'create_todo' })
  async createTodo(newtodo: CreateTodoDto) {
    try {
      return this.todoService.createTodo(newtodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'delete_todo' })
  async deleteTodo(todo: DeleteTodoDto) {
    try {
      return this.todoService.deleteTodo(todo);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  @MessagePattern({ cmd: 'get_all_todos' })
  async getAllTodos(infotodo: GetAllTodosDto) {
    try {
      return this.todoService.getAllTodos(infotodo);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }
}
