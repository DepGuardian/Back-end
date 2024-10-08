import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  @MessagePattern({ cmd: 'get_users' })
  getUsers() {
    return 'This is a response from the user service!';
  }
}
