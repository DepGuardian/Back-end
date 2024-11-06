
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SuperAdminCreateDto } from './dtos/superAdmin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginData: { email: string; password: string; isSuperAdmin: boolean }) {
    console.log(loginData);
    return {
      access_token: this.authService.login(loginData),
      status: 'success'
    }
  }

  @Post('register')
  async register(@Body() registerData: { email: string; password: string; name: string; department: string; tenantId: string; accessCode: string }) {
    console.log(registerData);
    return this.authService.registerResident(registerData, registerData.tenantId, registerData.accessCode);
  }

  @Post('register-superadmin')
  async registerSuperAdmin(@Body() registerData: SuperAdminCreateDto) {
    return this.authService.registerSuperAdmin(registerData);
  }

  @Get('condominiums')
  getCondominiums() {
    return this.authService.getCondominiums();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}