import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { DeleteResult, Repository } from 'typeorm';
import { Machine } from '../models/machine.entity';

@Injectable()
export class MachineService {
    constructor( @InjectRepository(Machine) private repository: Repository<Machine>){
    }

    public saveConfiguration(machine: Machine): Promise<Machine>{
        if(machine.id){
           return this.repository.save(machine);
        }
        return this.repository.save({
             name: machine.name,
             config: machine.config
        });
    }

    public delete(id: string): Promise<DeleteResult> {
       return this.repository.delete({id: id});
    }
    public getById(machineId: string): Promise<Machine>{
       return this.repository.findOne({id: machineId});
    }

    public getAll(): Promise<Machine[]>{
        return this.repository.find();
     }
}
