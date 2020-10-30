import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { DashComponent } from './dash/dash.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card'
import { MatMenuModule } from '@angular/material/menu';
import { NewEngineComponent } from './shared/new-engine/new-engine.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
  
  
    
    
  ],
  imports: [
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
    FormsModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    NgbModule,
    MatProgressSpinnerModule
  ],
  providers: [SocketService],

  bootstrap: [AppComponent]
  
})
export class AppModule { }
