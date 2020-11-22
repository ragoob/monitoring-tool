import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './layout/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu';
import { NewEngineComponent } from './shared/new-engine/new-engine.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ContainersListComponent } from './charts/containers-list/containers-list.component';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import { SocketService } from './core/services/socket-io.service';
import { CpuTemperatureComponent } from './charts/cpu-temperature/cpu-temperature.component';
import { MemoryUsageComponent } from './charts/memory-usage/memory-usage.component';
import { SystemInfoComponent } from './charts/system-info/system-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageUsageComponent } from './charts/storage-usage/storage-usage.component';
import { ContainersComponent } from './charts/containers/containers.component';
import { ContainersMetricsComponent } from './charts/containers-metrics/containers-metrics.component';
import { LoaderComponent } from './shared/loader/loader.component';
import {MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NotificationComponent } from './shared/notification/notification.component';
import { API_BASE_URL } from './core/constant';
import { environment } from '../environments/environment';
import { RunImageComponent } from './shared/run-image/run-image.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './core/services/auth.guard.service';
import { AuthService } from './core/services/auth.service';
import { HomeComponent } from './home/home.component';
import { TokenInterceptor } from './core/services/auth.interceptor';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { DashComponent } from './dashboard/dash.component';
import { CommonModule } from '@angular/common';
import { ContainerMetricsCpuComponent } from './charts/container-metrics-cpu/container-metrics-cpu.component';
import { MenuListItemComponent } from './layout/menu-list-item/menu-list-item.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { PageTitleComponent } from './layout/page-title/page-title.component';
import { CardComponent } from './shared/card/card.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MemoryCardComponent } from './charts/memory-card/memory-card.component';
import { DiskCardComponent } from './charts/disk-card/disk-card.component';
import { CpuCardComponent } from './charts/cpu-card/cpu-card.component';
import { TempCardComponent } from './charts/temp-card/temp-card.component';
import { CpuUsageComponent } from './charts/cpu-usage/cpu-usage.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ContainerDetailsComponent } from './charts/container-details/container-details.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SummaryCardComponent } from './charts/summary-card/summary-card.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashComponent,
    NewEngineComponent,
    ContainersListComponent,
    CpuTemperatureComponent,
    MemoryUsageComponent,
    SystemInfoComponent,
    StorageUsageComponent,
    ContainersComponent,
    ContainersMetricsComponent,
    LoaderComponent,
    NotificationComponent,
    RunImageComponent,
    LoginComponent,
    HomeComponent,
    ContainerMetricsCpuComponent,
    MenuListItemComponent,
    PageTitleComponent,
    CardComponent,
    MemoryCardComponent,
    DiskCardComponent,
    CpuCardComponent,
    TempCardComponent,
    CpuUsageComponent,
    ContainerDetailsComponent,
    SummaryCardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NgMaterialMultilevelMenuModule,
    FlexLayoutModule,
    NgApexchartsModule,
    MatProgressBarModule,
    NgxSpinnerModule,
    PerfectScrollbarModule,
    ConfirmDialogModule
    
  ],
  providers: [
    SocketService,
    { provide: API_BASE_URL, useValue: environment.gateWay }
    ,AuthService,AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ConfirmationService
  
  ],

  bootstrap: [AppComponent]
  
})
export class AppModule { }
