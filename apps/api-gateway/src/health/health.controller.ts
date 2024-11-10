import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection('general') private readonly connection: Connection,
  ) {}

  @Get('/db')
  async checkDb() {
    const state = this.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };

    return {
      status: state === 1 ? 'up' : 'down',
      details: {
        state: states[state],
        connected: state === 1,
        databases: {
          general: {
            status: state === 1 ? 'connected' : 'disconnected',
            name: this.connection.name,
            host: this.connection.host,
          },
        },
      },
    };
  }
}
