import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-add-folder',
  templateUrl: 'add-folder.component.html',
  styleUrls: ['add-folder.component.scss'],
})


export class AddfolderComponent {

  constructor(protected ref: NbDialogRef<AddfolderComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
