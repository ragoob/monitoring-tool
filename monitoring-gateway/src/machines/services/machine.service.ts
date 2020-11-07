import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { Machine } from '../models/machine.entity';

@Injectable()
export class MachineService {
    constructor( @InjectRepository(Machine) private repository: Repository<Machine>){
    }

    public saveConfiguration(machine: Machine): Promise<Machine>{
 
        return this.repository.save(machine);
    }

    public getConfiguration(machineId: string): Promise<Machine>{
       return this.repository.findOne({id: machineId});
    }

    public getAll(): Promise<Machine[]>{
        return this.repository.find();
     }
}
