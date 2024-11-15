import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  TodoDto,
  CreateTodoDto,
  DeleteTodoDto,
  GetAllTodosDto,
} from '../../../libs/dtos/todo.dto';
import { Resident, ResidentSchema } from '@libs/schemas/resident.schema';
import { DatabaseConnectionService } from '@database/database.service';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    private readonly databaseConnectionService: DatabaseConnectionService,
  ) {}

  async createTodo(newtodo: CreateTodoDto) {
    const newTodo: TodoDto = {
      id: new Types.ObjectId(),
      title: newtodo.data.title,
      done: false,
    };

    this.logger.debug(
      `Created todo with ID: ${newTodo.id} for tenant ${newtodo.tenantId}`,
    );
    const tenantConnection = await this.databaseConnectionService.getConnection(
      newtodo.tenantId,
    );
    const ResidentModel = tenantConnection.model<Resident>(
      'Resident',
      ResidentSchema,
    );
    const residentUpdate = ResidentModel.findByIdAndUpdate(newtodo.residentId, {
      $push: { todo_list: newTodo },
    });
    if (!residentUpdate) {
      throw new NotFoundException(
        `Resident with ID ${newtodo.residentId} not found`,
      );
    }
    return residentUpdate;
  }

  async deleteTodo(todo: DeleteTodoDto) {
    const tenantConnection = await this.databaseConnectionService.getConnection(
      todo.tenantId,
    );
    const ResidentModel = tenantConnection.model<Resident>(
      'Resident',
      ResidentSchema,
    );

    const residentUpdate = await ResidentModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(todo.residentId),
        'todo_list.id': new Types.ObjectId(todo.todoId),
      },
      {
        $set: { 'todo_list.$.done': true },
      },
      { new: true },
    ).exec();

    this.logger.debug(`Resident update: ${JSON.stringify(residentUpdate)}`);

    this.logger.debug(
      `Updated todo with ID: ${todo.todoId} for tenant ${todo.tenantId}`,
    );
    if (!residentUpdate) {
      throw new NotFoundException(
        `Resident with ID ${todo.residentId} not found`,
      );
    }

    return residentUpdate;
  }

  async getAllTodos(infotodo: GetAllTodosDto) {
    const tenantConnection = await this.databaseConnectionService.getConnection(
      infotodo.tenantId,
    );
    const ResidentModel = tenantConnection.model<Resident>(
      'Resident',
      ResidentSchema,
    );
    const resident = await ResidentModel.findById(infotodo.residentId);
    if (!resident) {
      throw new NotFoundException(
        `Resident with ID ${infotodo.residentId} not found`,
      );
    }
    return resident.todo_list.filter((todo) => !todo.done);
  }
}
