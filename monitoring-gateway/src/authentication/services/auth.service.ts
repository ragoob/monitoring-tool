import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { User } from '../models/user.entity';
import { LoginModel } from '../models/login.model';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        @InjectRepository(User) private readonly userRepository: Repository<User>) {

    }

    public async create(model: User): Promise<void> {
        try {
            const salt = await bcrypt.genSalt();
            const user: User = new User();
            Object.assign(user, model);
            user.password = await this.hashPassword(model.password, salt);
            user.passwordSalt = salt;
            await this.userRepository.save(user);
        } catch (error) {
            throw new ConflictException(`User name already exists`);
        }
    }

    public async update(model: User): Promise<void> {
        try {
            const user = await this.findById(model.id);
            if(model.password){
                const salt = await bcrypt.genSalt(); 
                user.password = await this.hashPassword(model.password, salt);
                user.passwordSalt = salt;
            }

            user.email = model.email;
            user.allowedMachines = model.allowedMachines;
            user.isAdmin = model.isAdmin;
           
            await this.userRepository.save(user);
        } catch (error) {
            throw new ConflictException(`User name already exists`);
        }
    }

    public findById(id: number): Promise<User>{
        return this.userRepository.findOne({id: id});
    }

    

    public findByEmail(email: string): Promise<User>{
        return this.userRepository.findOne({email: email});
    }

    public findAll(): Promise<User[]>{
        return this.userRepository.find();
    }


    public async token(model: LoginModel): Promise<any> {
       try {
           const user: User = await this.userRepository.findOne({ email: model.email });
           let verfiyPassword = false;
           console.log('user in db ', user);
          try {
               verfiyPassword = await user.validatePassword(model.password);
          } catch (error) {
              console.log('failed to verfiy password');
          }
           if (user && verfiyPassword) {
            //    const accessToken = this.jwtService.sign({
            //        email: user.email,
            //        isAdmin: user.isAdmin,
            //        allowedMachines: user.allowedMachines

            //    }, {
            //        expiresIn: "7d",

            //    });
               console.log({
                   accessToken: "no access token",
                   email: model.email
               })
               return {
                   accessToken: "no access token",
                   email: model.email
               }
           }
           else {
               throw new UnauthorizedException("Invalid username or password");
           }
       } catch (error) {
           console.log(error);
           return {
               error: error,
               sussess: false
           }
           
       }
    }

    public delete(id: number){
        return this.userRepository.delete({id: id});
    }
    private  hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }



}