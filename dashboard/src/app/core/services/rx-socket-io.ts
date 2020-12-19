
import { Observable, Observer, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as socketIO from 'socket.io-client';
import { Events } from '../models/events';

export class RxSocket<DT> {
  private socket: SocketIOClient.Socket;

  constructor(url: string, options?: SocketIOClient.ConnectOpts) {
    this.socket = socketIO(url, options);

  }

  
  public disconnect(): void {
    this.socket.disconnect();
    this.socket.close();
  }

  public connect(): void {
    this.socket.connect();
  }

  public observable<T = DT>(event: string): Observable<T> {
    return this.createEventObservable<T>(event);
  }

  public subject<T = DT>(event: string): Subject<T> {
    return this.createEventSubject<T>(event);
  }

  private createEventSubject<T>(event: string): Subject<T> {
    const incoming$ = this.createEventObservable<T>(event);
    const outgoing = {
      next: (data: T) => {
        this.socket.emit(event, data);
      },
    };
    return Subject.create(outgoing, incoming$);
  }

  private createEventObservable<T>(event: string): Observable<T> {
    return new Observable(
      (incoming: Observer<T>) => {
        this.socket.on(event, (data: T) => {
          incoming.next(data);
        });
        return () => { this.onEventSubjectUnsubscribe(); };
      });
  }

  private onEventSubjectUnsubscribe(): void {
   this.disconnect();
  }

}