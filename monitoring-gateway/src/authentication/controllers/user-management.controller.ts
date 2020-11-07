import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../services/jwt.auth.guard';

@Controller('user-management')
@UseGuards(JwtAuthGuard)
export class UserManagementController {
    constructor(private userService: AuthService){}

    @Get()
    public getUsers(): Promise<User[]>{

        return this.userService.findAll();
    }

    @Get(':id')
    public getUserById(@Param('id') id : number): Promise<User>{

        return this.userService.findById(id);
    }

    @Post()
    public create(@Body() user: User): Promise<void>{

        return this.userService.create(user);
    }

    @Put()
    public update(@Body() user: User): Promise<void>{

        return this.userService.update(user);
    }

    @Delete(':id')
    public delete(@Param('id') id: number){
        return this.userService.delete(id);
    }
}

