import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DndDirective } from './dnd.directive';
// import { FilesComponent } from './files/files.component';
import { ProgressComponent } from './progress/progress.component';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
// import {CreateComponent} from './create/create.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, UploadRoutingModule],
  declarations: [ DndDirective, ProgressComponent, UploadComponent ],
  // bootstrap:    [ FilesComponent ]
})
export class UploadModule { }

