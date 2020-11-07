import { Column, Entity, PrimaryColumn } from "typeorm";
import { MachineConfiguration } from "./machine-config.model";

@Entity('machines')
export class Machine{
 @PrimaryColumn()
 id: string;
 @Column()
 name: string;
 @Column({type: "jsonb",nullable:true})
 config?: MachineConfiguration
}