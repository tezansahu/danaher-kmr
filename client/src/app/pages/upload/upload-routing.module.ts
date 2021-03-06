import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './upload.component';
import { FilesComponent } from './files/files.component';

const routes: Routes = [{
  path: '',
  component: UploadComponent,
  children: [ {
    path: 'files',
    component: FilesComponent,
//   }, {
//     path: 'icons',
//     component: IconsComponent,
//   }, {
//     path: 'typography',
//     component: TypographyComponent,
//   }, {
//     path: 'search-fields',
//     component: SearchComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule { }
