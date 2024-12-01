import {
  CreateCommonAreaDto,
  GetByNameDto,
  GetByStatusDto,
  DeleteCommonAreaDto,
  UpdateCommonAreaDto,
} from '@libs/dtos/common_area.dto';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommonAreaClientService {
  private readonly logger = new Logger(CommonAreaClientService.name);
  constructor(
    @Inject('COMMON_AREA_SERVICE')
    private readonly commonAreaClient: ClientProxy,
  ) {}

  async createCommonArea(registerData: CreateCommonAreaDto) {
    try {
      const pattern = { cmd: 'createCommonArea' };
      return firstValueFrom(this.commonAreaClient.send(pattern, registerData));
    } catch (error) {
      this.logger.error('Failed to create common area', error.stack);
      throw new Error(error);
    }
  }

  async getAll(tenantId: string) {
    try {
      const pattern = { cmd: 'getAll' };
      return firstValueFrom(this.commonAreaClient.send(pattern, tenantId));
    } catch (error) {
      this.logger.error('Failed to retrieve common areas', error.stack);
      throw new Error(error);
    }
  }

  async getByStatus(data: GetByStatusDto) {
    try {
      const pattern = { cmd: 'getByStatus' };
      return firstValueFrom(this.commonAreaClient.send(pattern, data)); // No se si esta bien esto
    } catch (error) {
      this.logger.error('Failed to retrieve common areas', error.stack);
      throw new Error(error);
    }
  }

  async getByName(data: GetByNameDto) {
    try {
      const pattern = { cmd: 'getByName' };
      return firstValueFrom(this.commonAreaClient.send(pattern, data)); // No se si esta bien esto
    } catch (error) {
      this.logger.error('Failed to retrieve common areas', error.stack);
      throw new Error(error);
    }
  }

  async deleteCommonArea(data: DeleteCommonAreaDto) {
    try {
      const pattern = { cmd: 'deleteCommonArea' };
      return firstValueFrom(this.commonAreaClient.send(pattern, data));
    } catch (error) {
      this.logger.error('Failed to delete common area', error.stack);
      throw new Error(error);
    }
  }

  async updateCommonArea(data: UpdateCommonAreaDto) {
    try {
      const pattern = { cmd: 'updateCommonArea' };
      return firstValueFrom(this.commonAreaClient.send(pattern, data));
    } catch (error) {
      this.logger.error('Failed to update common area', error.stack);
      throw new Error(error);
    }
  }
}
