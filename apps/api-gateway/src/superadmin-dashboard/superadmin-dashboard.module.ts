import { Module } from '@nestjs/common';
import { SuperAdminDashboardService } from './superadmin-dashboard.service';
import { SuperAdminDashboardController } from './superadmin-dashboard.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [SuperAdminDashboardService],
  controllers: [SuperAdminDashboardController],
})
export class SuperAdminDashboardModule {}