import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateApartmentDto, RefreshCodeDto } from '@libs/dtos/apartment.dto';
import { ApartmentService } from './apartment.service';

@Controller()
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @MessagePattern({ cmd: 'createApartment' })
  async createApartment(data: CreateApartmentDto) {
    return this.apartmentService.createApartment(data);
  }

  @MessagePattern({cmd: 'refreshCode'})
  async refreshCode(data: RefreshCodeDto){
    return this.apartmentService.refreshCode(data);
  }

  @MessagePattern({cmd: 'getAll'})
  async getAll(tenantId:string){
    return this.apartmentService.getAll(tenantId);
  }
}
