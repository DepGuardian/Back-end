import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  TodoDto,
  CreateTodoDto,
  DeleteTodoDto,
  GetAllTodosDto,
} from '@libs/dtos/todo.dto';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';
import { DatabaseConnectionService } from '@database/database.service';
import { TypeErrors } from '@libs/constants/errors';
import { ResponseDto } from '@libs/dtos/response.dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async createTodo(newtodo: CreateTodoDto): Promise<ResponseDto> {
    try {
      console.log(newtodo);
      const newTodo: TodoDto = {
        id: new Types.ObjectId(),
        title: newtodo.data.title,
        done: false,
      };
      console.log(newTodo);
      const tenantConnection =
        await this.databaseConnectionService.getConnection(newtodo.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const ResidentModel = tenantConnection.model<Resident>(
        'Resident',
        ResidentSchema,
      );

      const residentUpdate = await ResidentModel.findByIdAndUpdate(
        Types.ObjectId.createFromHexString(newtodo.residentId),
        {
          $push: { todo_list: newTodo },
        },
      ).exec();

      if (!residentUpdate) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.RESIDENT_NOT_FOUND,
        };
      }
      return {
        status: HttpStatus.OK,
        data: newTodo,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error('Error creating todo:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteTodo(todo: DeleteTodoDto): Promise<ResponseDto> {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(todo.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const ResidentModel = tenantConnection.model<Resident>(
        'Resident',
        ResidentSchema,
      );

      const residentUpdate = await ResidentModel.findOneAndUpdate(
        {
          _id: Types.ObjectId.createFromHexString(todo.residentId),
          'todo_list.id': Types.ObjectId.createFromHexString(todo.todoId),
        },
        {
          $set: { 'todo_list.$.done': true },
        },
        { new: true },
      ).exec();

      if (!residentUpdate) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.RESIDENT_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: residentUpdate,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error('Error deleting todo:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getAllTodos(infotodo: GetAllTodosDto): Promise<ResponseDto> {
    try {
      const tenantConnection =
        await this.databaseConnectionService.getConnection(infotodo.tenantId);

      if (!tenantConnection) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.TENANT_NOT_FOUND,
        };
      }

      const ResidentModel = tenantConnection.model<Resident>(
        'Resident',
        ResidentSchema,
      );

      const resident = await ResidentModel.findById(infotodo.residentId);

      if (!resident) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          errorMessage: TypeErrors.RESIDENT_NOT_FOUND,
        };
      }

      const todoListInProcess = resident.todo_list.filter((todo) => !todo.done);

      return {
        status: HttpStatus.OK,
        data: todoListInProcess,
        errorMessage: null,
      };
    } catch (error) {
      this.logger.error('Error getting all todos:', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        errorMessage: TypeErrors.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
