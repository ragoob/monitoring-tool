import { AnyTxtRecord } from "dns";

export class DockerCommandResult{
    success: boolean;
    error?: string | any;
    stdout?: string;
}