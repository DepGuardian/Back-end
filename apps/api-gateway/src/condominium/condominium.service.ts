import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condominium } from './condominium.schema';
import { CreateCondominiumDto } from './dtos/condominium.dto';

@Injectable()
export class CondominiumService {
  constructor(
    @InjectModel(Condominium.name)
    private readonly condominiumModel: Model<Condominium>,
  ) {}

  async getAllCondominiums(): Promise<Condominium[]> {
    return this.condominiumModel.find().exec();
  }

  async createCondominium(
    createCondominiumDto: CreateCondominiumDto,
  ): Promise<Condominium> {
    const newCondominium = new this.condominiumModel(createCondominiumDto);
    return newCondominium.save();
  }
}
