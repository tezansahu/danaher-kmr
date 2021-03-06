import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbSidebarModule,
  NbLayoutModule
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DndDirective } from './dnd.directive';
// import { FilesComponent } from './files/files.component';
import { ProgressComponent } from './progress/progress.component';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import {CreateComponent} from './create/create.component';

@NgModule({
  imports:      [ FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    BrowserModule, FormsModule, UploadRoutingModule, 
    NbSidebarModule,
    NbLayoutModule],
  declarations: [ CreateComponent, DndDirective, ProgressComponent, UploadComponent ],
  // bootstrap:    [ FilesComponent ]
})
export class UploadModule { }

