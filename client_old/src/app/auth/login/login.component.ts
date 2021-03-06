import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { LoginForm, User } from '../../UserDetails';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
// import { CodefetchService } from 'src/app/codefetch.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {
  user: LoginForm;
  returndata: User;

  constructor(private api: ApiService, public router: Router, service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) options: {}, cd: ChangeDetectorRef, rt: Router, private toastrService: NbToastrService) {
      super(service, options, cd, router);
  }

  login() {
    this.api.loginUser(this.user)
      .subscribe(data => {
        this.returndata = data;
        // console.log(data);
        if (this.returndata.success) {
          // this._fileService.openedFileDataChange.next("")
          // this._fileService.changeOpenedFile({name: 'Choose File', id: -1, path: ''});
          this.router.navigate(['dashboard']);
        }
      },
      error => {
        // console.log(error);
        // this.errorMsg = error.error.message;
        // this.errorOcc = true;
        let status: NbComponentStatus = "danger";
        this.toastrService.show(error.error.message, "Error", {status});
      });
  }
}