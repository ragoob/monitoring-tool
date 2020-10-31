export class CreateContainerOptions{
    image: string;
    ports?: CreateContainerOptionsPorts[];
    cmd?: string;
    envirnment?: CreateContainerOptionsEnv[];
    volumes: string[];
    options: string[];
    name?: string;

}

export class CreateContainerOptionsPorts{
    hostPort: string;
    containerPort: string;
}

export class CreateContainerOptionsEnv{
    key: string;
    value: string;
}
