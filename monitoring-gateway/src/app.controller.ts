import { Controller, Get, HttpCode, Logger} from '@nestjs/common';

@Controller()
export class AppController {
  private logger: Logger = new Logger();
  constructor() {}

  @Get()
  @HttpCode(204)
  isAlive() {
   this.logger.debug(`App is a live`);
  }

  
 
}
