import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ContainerMetrics } from '../models/container-metrics.model';
import { Container } from '../models/container.model';
import { CreateContainerOptions } from '../models/create-container-options.model';
import { DockerCommandResult } from '../models/docker.command.result';
import { ContainerService } from '../services/container.service';

@Controller('container')
@ApiTags('containers')
export class ContainerController {
    constructor(private containerService: ContainerService){}
    
    @Get('logs')
    @ApiOperation({description: 'Get Logs of continer'})
    public getLogs(@Query() Params): Promise<string>{
        return this.containerService.logs(Params.id);
    }


    @Post()
    @HttpCode(200)
    @ApiOperation({description: 'Create container'})
    public create(@Body() options: CreateContainerOptions): Promise<DockerCommandResult>{
        return this.containerService.createContainer(options);
    }

    @Put('restart')
    @HttpCode(200)
    @ApiOperation({description: 'Restart container'})
    public restart(@Body() body: any): Promise<DockerCommandResult>{
        return this.containerService.restart(body.id,body.autoRestart);
    }

    @Put('stop')
    @HttpCode(200)
    @ApiOperation({description: 'Restart container'})
    public stop(@Body() body: any): Promise<DockerCommandResult>{
        return this.containerService.stop(body.id);
    }

    @Put('start')
    @HttpCode(200)
    @ApiOperation({description: 'Restart container'})
    public start(@Body() body: any): Promise<DockerCommandResult>{
        return this.containerService.start(body.id);
    }


    @Delete(':id')
    @HttpCode(200)
    @ApiOperation({description: 'Delete Container'})
    public kill(@Param('id') id: string): Promise<DockerCommandResult>{
        return this.containerService.killContainer(id);
    }


}
