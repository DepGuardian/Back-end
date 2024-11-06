import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { SuperAdmin, SuperAdminSchema } from '../superadmin-dashboard/superadmin.schema';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SuperAdmin.name, schema: SuperAdminSchema },
    ]),
    DatabaseModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}