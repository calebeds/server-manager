import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom.response';
import { Server } from './interface/server';
import { NotificationService } from './service/notification.service';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush//Angular stops looking for changes!!! Instead he will only search for input, or observables, or event emitters, increasing performance. That's the reason the reactive approach is powerful
})
export class AppComponent implements OnInit {
  //The reason why we used observables and behavior objects
  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;//The enum with status
  private filterSubject = new BehaviorSubject<string>('');
  filterStatus$ = this.filterSubject.asObservable();//He gets used on spinner of ping
  private dataSubject = new BehaviorSubject<CustomResponse>({
    timeStamp: new Date(),
    statusCode: 0,
    status: '',
    reason: '',
    message: '',
    developerMessage: '',
    data: {}
  });
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();



  constructor(private serverService: ServerService, private notificationService :NotificationService) {

  }

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          this.dataSubject.next(response);//Saving the data on a behavior subject| Gets used on pingServer
          return { dataState: DataState.LOADED_STATE, appData: {...response, data: {servers: response.data.servers?.reverse()}} }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          this.notificationService.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          const index = this.dataSubject.value!.data.servers!.findIndex(server => {
            return server!.id === response.data.server!.id //Just finding the id of the server we want to ping
          });
          this.dataSubject.value!.data.servers![index] = response.data.server!;
          this.filterSubject.next('');
          this.notificationService.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),//Now the dataSubject comes on to play
        catchError((error: string) => {
          this.filterSubject.next('');
          this.notificationService.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(<Server>serverForm.value)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: {servers: [response.data.server!, ...this.dataSubject.value.data.servers!]}}
          );
          document.getElementById('closeModal')?.click();
          this.isLoading.next(false);
          serverForm.resetForm({status: this.Status.SERVER_DOWN});
          this.notificationService.onSuccess(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),//Now the dataSubject comes on to play
        catchError((error: string) => {
          this.isLoading.next(false);
          this.notificationService.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  filterServers(status: any): void {//I tried status: Status, but It didn't workout because we receive event on html
    console.log('here');
    console.log(status);
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          this.notificationService.onDefault(response.message);
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),//Now the dataSubject comes on to play
        catchError((error: string) => {
          this.notificationService.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }

  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: {servers: this.dataSubject.value.data.servers!.filter(s => {
              return s.id !== server.id
            })}}
          );
          this.notificationService.onWarning(response.message);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),//Now the dataSubject comes on to play
        catchError((error: string) => {
          this.notificationService.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      )
  }


  printReport(selectedReport: any): void {
    if(selectedReport === 'pdf') {
      window.print();
    } else {
      let dataType: string = 'application/vnd.ms-excel.sheet.macroEnabled.12';
      let tableSelect: HTMLElement | null = document.getElementById('servers');
      let tableHtml: string = tableSelect!.outerHTML.replace(/ /g, '%20');
      let downloadLink: HTMLAnchorElement = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = `data: ${dataType}, ${tableHtml}`;
      downloadLink.download = 'server-report.xls';
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    this.notificationService.onDefault('The Download Has Begun');
  }
}
