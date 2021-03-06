import { Component, TemplateRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddfolderComponent } from './add-folder/add-folder.component';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-create',
//   templateUrl: '../../dashboard/dashboard.component.html',
//   styleUrls: ['../../dashboard/dashboard.component.scss'],
    // templateUrl: './add-folder/add-folder.component.html', 
    // styleUrls: ['./add-folder/add-folder.component.scss']
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})


export class CreateComponent {

  names: string[] = [];

  constructor(private dialogService: NbDialogService) {
      console.log("Hi");
    this.dialogService.open(AddfolderComponent)
    .onClose.subscribe(name => name && this.names.push(name));
  }

//   cancel() {
//     AddfolderComponent.close();
//   }

//   submit(name) {
//     this.ref.close(name);
//   }

}