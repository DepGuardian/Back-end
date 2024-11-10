import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
//Get todos los residentes 
@Injectable()
export class ResidentClientService {
    constructor(
        @Inject('RESIDENT_SERVICE') private readonly residentClient: ClientProxy,
    ) {}

    async getResidents() {
        try {
            const pattern = { cmd: 'getall' };
            return firstValueFrom(this.residentClient.send(pattern, {}));
        } catch (error) {
            throw error;
        }
    }
}