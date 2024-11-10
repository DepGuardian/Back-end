
import { ConflictException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from './apartment.dto';

@Controller()
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}
  
  @MessagePattern({ cmd: 'createApartment' })
  async createApartment(data: CreateApartmentDto) {
    return this.apartmentService.createApartment(data);
  }
}
