import { User } from './UserDetails';
import { ApiService } from './api.service';
import { Router, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {
    private data : User;

    constructor(private _sd: ApiService, private router: Router) {}
    canActivate(): Promise<boolean> {
        return new Promise((resolve, reject) => {this._sd.getDetails()
            .subscribe(data => {
                this.data = data;
                // console.log(this.data);
                if (this.data == undefined || !this.data.loggedin) {
                    this.router.navigate(['auth','login']);
                    resolve(false);  
                } else{
                    resolve(true);
                } 
            }, error => {
                this.router.navigate(['auth','login']);
                resolve(false);
            });
        });
    }
}

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard2 implements CanActivate {
    private data : User;

    constructor(private _sd: ApiService, private router: Router) {}
    canActivate(): Promise<boolean> {
        return new Promise((resolve, reject) => {this._sd.getDetails()
            .subscribe(data => {
                this.data = data;
                // console.log(this.data);
                if (this.data == undefined || !this.data.loggedin) {
                    resolve(true);  
                } else{
                    this.router.navigate(['dashboard','main']);
                    resolve(false);
                } 
            }, error => {resolve(true);});
        });
    }
}