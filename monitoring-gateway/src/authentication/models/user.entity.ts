import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity('users')
export  class User{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique:true})
    email: string;
    @Column()
    password: string;
    @Column()
    passwordSalt: string;
    @Column({default:false})
    isAdmin: boolean;
    @Column({type: "jsonb",nullable:true})
    allowedMachines?: string[]

     validatePassword(password: string): Promise<boolean> {
         return new Promise<boolean>((resolve,reject)=>{
            bcrypt.hash(password, this.passwordSalt)
            .then((password: string)=> {
                resolve(password === this.password);
            },error=> {
                reject(error);
            })
         })
        
    }

}