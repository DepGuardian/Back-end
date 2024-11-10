import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ResidentService } from './resident.service';

@Controller()
export class ResidentController {
  constructor(private readonly residentServide: ResidentService) {}
  @MessagePattern({ cmd: 'getall' })
  async getAll(tenantId: string) {
    try {
      return this.residentServide.getAllResidents(tenantId);
    } catch (error) {
      console.error('Error fetching residents:', error);
      throw error;
    }
  }
}
