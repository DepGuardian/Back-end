import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuperAdminDashboardService } from './superadmin-dashboard.service';

@Controller('super-admin-dashboard')
@UseGuards(JwtAuthGuard)
export class SuperAdminDashboardController {
  constructor(private readonly dashboardService: SuperAdminDashboardService) {}

  @Get('condominium/:superAdminId')
  async getCondominiums(@Param('superAdminId') superAdminId: string) {
    return this.dashboardService.getCondominium(superAdminId);
  }
}