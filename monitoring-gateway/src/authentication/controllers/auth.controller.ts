import { Body, Controller, Logger, OnModuleInit, Post, ValidationPipe } from '@nestjs/common';
import { LoginModel } from '../models/login.model';
import { User } from '../models/user.entity';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController implements OnModuleInit{
    private logger: Logger = new Logger(AuthController.name);
    constructor(private authService: AuthService) {
    }
    onModuleInit() {
       
        const defaults: User = new User();
            defaults.isAdmin = true;
            defaults.email = process.env.DEFAULT_ADMIN;
            defaults.password = process.env.DEFAULT_PASSWORD;
           this.authService.findByEmail(defaults.email)
           .then((user: User)=> {
             
             if(!user){
                 this.authService.create(defaults);
             }
           })
    }

    @Post('token')
     signIn(@Body(ValidationPipe) model: LoginModel): Promise<{}> {
        return this.authService.token(model);
    }
}
