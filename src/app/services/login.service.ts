import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private rootUrl: string = 'http://20.107.120.208:8080';
  private token: string;
  private user: User;

  constructor(
    private http: HttpClient,
    private store: StoreService
  ) { }

  login(user: string, password: string): Promise<void>{
    return new Promise((resolve, reject) =>{      
      let url = this.rootUrl+'/login';
      this.http.post(url,{
        username: user,
        password: password
      })
      .subscribe(
        (res: any)  => {
          if(res.status==500)
            return reject(res.messages);
          this.user = this.cloneUser(res.data.user);
          this.token = res.data.token;
          this.store.setData('user',this.user);
          this.store.setData('token', this.token);
          resolve();
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  logout():Promise<void>{
    return new Promise((resolve, reject) => {
      this.token = null;
      this.user = null;
      this.store.setData('user', '');
      resolve();
    })
  }

  getUser(): User{
    if(!this.user)
      return this.cloneUser(this.store.getDataPermanent('user'));
    return this.user;
  }

  getToken(): string{
    if(!this.token)
      return this.store.getDataPermanent('token');
    return this.token;
  }

  cloneUser(user: any): User {
    return {
      id: parseInt(user.id),
      centro_id: parseInt(user.centro_id),
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
      type: parseInt(user.type)
    }
  }

}
