import { Body, Controller, Get, Post } from '@nestjs/common';
import { CondominiumService } from './condominium.service';
import { CreateCondominiumDto } from './dtos/condominium.dto';

@Controller('condominiums')
export class CondominiumController {
  constructor(private readonly condominiumService: CondominiumService) {}

  @Get()
  async getAllCondominiums() {
    return this.condominiumService.getAllCondominiums();
  }

  @Post()
  async createCondominium(@Body() createCondominiumDto: CreateCondominiumDto) {
    try {
      return await this.condominiumService.createCondominium(
        createCondominiumDto,
      );
    } catch (error) {
      return error;
    }
  }
}
