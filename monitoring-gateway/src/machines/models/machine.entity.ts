import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { MachineConfiguration } from "./machine-config.model";

@Entity('machines')
export class Machine{
@PrimaryGeneratedColumn("uuid") 
 id: string;
 @Column()
 name: string;
 @Column({type: "jsonb",nullable:true})
 config?: MachineConfiguration
}