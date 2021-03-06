import { Injectable } from '@angular/core';
import { User, SignUpForm, LoginForm } from './UserDetails';
import { HttpClient, HttpHandler, HttpHeaders, HttpClientXsrfModule } from '@angular/common/http';
import { Observable } from 'rxjs';
// import 'rxjs/add/observable/of';
import { API } from '../API';
import { tap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _url: string = API.ServerURL;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) {}

  getDetails() : Observable<User> {
    return this.http.get<User>(this._url + API.GetDetails);
  }

  registerUser(data: SignUpForm) : Observable<User> {
    return this.http.post<User>(this._url + API.Register, data, this.httpOptions)
            .pipe(tap(res => this.setSession(res)));
  }
  loginUser(data: LoginForm) : Observable<User> {
    return this.http.post<User>(this._url + API.Login, data, this.httpOptions)
            .pipe(tap(res => this.setSession(res)));
  }
  logoutUser() {
    return this.http.get<User>(this._url + API.Logout)
              .pipe(tap(() => {localStorage.removeItem('token')}));
  }
  private setSession(authResult) {
    if (authResult.success) {
      localStorage.setItem('token', authResult.token);
    }
  }          


}
