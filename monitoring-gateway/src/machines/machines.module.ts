import { Module } from '@nestjs/common';
import { MachineService } from './services/machine.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from './models/machine.entity';
import { MachineController } from './controllers/machine.controller';
import { SocketService } from '../core/socket.service';

@Module({
    imports: [TypeOrmModule.forFeature([Machine])],
    providers: [SocketService,MachineService],
    controllers: [MachineController]
})
export class MachinesModule {}
