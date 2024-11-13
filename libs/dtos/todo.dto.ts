import { Types } from 'mongoose';

export interface TodoDto {
    title: string;
    done: boolean;
    id?: Types.ObjectId;
    }

export interface CreateTodoDto {
    tenantId: string;
    data: TodoDto; 
    residentId: Types.ObjectId;
}

export interface DeleteTodoDto {
    tenantId: string;
    todoId: Types.ObjectId;
    residentId: Types.ObjectId;
}

export interface GetAllTodosDto {
    tenantId: string;
    residentId: Types.ObjectId;
}