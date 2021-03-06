import { Component, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddfolderComponent } from './add-folder/add-folder.component';

@Component({
  selector: 'ngx-create',
//   templateUrl: './create.component.html',
  styleUrls: ['./add-folder/add-folder.cmponent.scss'],
})
export class CreateComponent {

  names: string[] = [];

  constructor(private dialogService: NbDialogService) {
    this.dialogService.open(AddfolderComponent)
    .onClose.subscribe(name => name && this.names.push(name));
  }

}