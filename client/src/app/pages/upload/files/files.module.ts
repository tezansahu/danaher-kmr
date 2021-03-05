import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DndDirective } from './dnd.directive';
import { FilesComponent } from './files.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ FilesComponent, DndDirective, ProgressComponent ],
  bootstrap:    [ FilesComponent ]
})
export class FilesModule { }

