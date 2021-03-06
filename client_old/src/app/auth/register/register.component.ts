import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { NbRegisterComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { SignUpForm, User } from '../../UserDetails';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
// import { CodefetchService } from 'src/app/codefetch.service';

@Component({
  selector: 'app-root',
  templateUrl: './register.component.html',
})
export class RegisterComponent extends NbRegisterComponent {
  user: SignUpForm;
  returndata: User;

  constructor(private api: ApiService,
              public router: Router,
              service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) options: {},
              cd: ChangeDetectorRef,
              rt: Router,
              private toastrService: NbToastrService
              ) {
      super(service, options, cd, router);
  }

  register() {
    this.api.registerUser(this.user)
      .subscribe(data => {
        this.returndata = data;
        console.log(data);
        if (this.returndata.success) {
          // this._fileService.openedFileDataChange.next("")
          // this._fileService.changeOpenedFile({name: 'Choose File', id: -1, path: ''});
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        console.log(error);
        // console.log(JSON.parse(error.error.errors));
        let status: NbComponentStatus = "danger";
        this.toastrService.show(Object.values(JSON.parse(error.error.errors))[0][0].message, "Error", {status});
      });
  }
}