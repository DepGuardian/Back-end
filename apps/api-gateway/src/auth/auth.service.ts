import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CondominiumService } from '../condominium/condominium.service';
import { SuperAdminCreateDto } from './dtos/superAdmin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly condominiumService: CondominiumService,
  ) {}

  // async validateUser(email: string, password: string, isSuperAdmin: boolean): Promise<any> {
  //   if (isSuperAdmin) {
  //     const user = await this.userService.findSuperAdminByEmail(email);
  //     if (user && await this.userService.comparePassword(password, user.password)) {
  //       const { password, ...result } = user;
  //       return result;
  //     }
  //   } else {
  //     try {
  //       const tenantId = await this.condominiumService.getTenantIdByEmail(email);
  //       const user = await this.userService.findResidentByEmail(email, tenantId);
  //       if (user && await this.userService.comparePassword(password, user.password)) {
  //         const { password, ...result } = user;
  //         return result;
  //       }
  //     } catch (error) {
  //       // Manejar el caso donde el email no se encuentra en ningún condominio
  //       console.error('User not found:', error);
  //     }
  //   }
  //   return null;
  // }

  async login(user: any) {
    if (!user) {
      return null;
    }

    if (user.isSuperAdmin) {
      const superAdmin = await this.userService.findSuperAdminByEmail(user.email);
      if (!superAdmin) {
        return null;
      }

      if (!await this.userService.comparePassword(user.password, superAdmin.password)) {
        return null;
      }

      return {
        access_token: this.jwtService.sign({
          sub: superAdmin._id,
          email: superAdmin.email,
          role: 'superadmin',
          condominiumId: superAdmin.condominiumId,
        }),
      };
    } else {
      // TODO Implementar API de residentes por tenantID
      // const resident = await this.userService.findResidentByEmail(user.email, tenantId);
      // if (!resident) {
      //   return null;
      // }
      return null;
    }
  }

  async registerSuperAdmin(userData: SuperAdminCreateDto) {
    const newUser = await this.userService.createSuperAdmin(userData);
    return newUser;
  }

  async registerResident(userData: any, tenantId: string, accessCode: string) {
    // TODO implementar validación de accessCode
    
    // const isValidAccessCode = await this.condominiumService.validateAccessCode(tenantId, userData.department, accessCode);
    // if (!isValidAccessCode) {
    //   throw new Error('Invalid access code');
    // }

    const newUser = await this.userService.createResident(userData, tenantId);
    console.log('New user (ALL GOOD):', newUser);
    return newUser;
  }

  async getCondominiums() {
    return this.condominiumService.getAllCondominiums();
  }
}
