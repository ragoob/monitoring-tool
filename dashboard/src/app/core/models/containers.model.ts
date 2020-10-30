export class Containers{
    id: string;
    image: string;
    status: string;
    createdAt: Date;
    ports: any;
    name: string;
    restartCount: number;
    isRunning: boolean;
    paused: boolean;
    restarting: boolean;
    ipAddress: string;
    error: string;
}