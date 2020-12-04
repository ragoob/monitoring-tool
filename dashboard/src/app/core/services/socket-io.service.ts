import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Events } from '../models/events';
import { RxSocket } from './rx-socket-io';
import * as socketIO from 'socket.io-client';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class SocketService {
  constructor() {

  }


  public emit(event, data) {
    const socket = socketIO(environment.socketServer);
    socket.emit(event, data);
  }

  public getDeamonAlive(daemonId: string): Observable<string> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable<string>(`ui-${Events.HEALTH_CHECK}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  public getDeamontemperature(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();



    const event$ = socket.observable(`ui-${Events.TEMPERATURE}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  public getDeamonMemoryUsage(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.MEMORY_USAGE}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )

  }

  public getDeamonCpuUsage(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.CPU_USAGE}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )

  }

  public getContainerUsage(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();



    const event$ = socket.observable(`ui-${Events.CONTAINERS_METRICS}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  public getContainerList(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();



    const event$ = socket.observable(`ui-${Events.CONTAINERS_LIST}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )

  }

  public getInfo(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.DOCKER_ENGINE_INFO}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  public getDisk(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.DISK_USAGE}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  public getSummary(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.SUMMARY}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }


  public getContainerlogs(daemonId: string): Observable<any> {
    const socket = this.getSocketInstance();

    const event$ = socket.observable(`ui-${Events.CONTAINER_LOGS}`);
    return event$.pipe(
      filter((data: any) => data.machineId == daemonId),
      map((data: any) => {
        return data.data;
      })
    )
  }

  private getSocketInstance() {
    return new RxSocket(`${environment.socketServer}`, {
      reconnection: true,
      transports: ['websocket'],
    });

  }

}