import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './upload.component';
// import { FilesComponent } from './files/files.component';
import {CreateComponent} from './create/create.component';

const routes: Routes = [{
  path: '',
  component: UploadComponent,
  children: [ {
    path: 'files',
    component: CreateComponent,
  }, {
    path: 'folder',
    component: CreateComponent,
  }, {
    path: 'create',
    component: CreateComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule { }
