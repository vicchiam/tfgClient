import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  public user: User;

  constructor(
    private lService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user=this.lService.getUser();    
  }

  go(url: string){
    this.router.navigateByUrl(url, {replaceUrl : true});
  }

  logout(){
    this.lService.logout()
      .then( () =>{        
        this.router.navigateByUrl('/login', {replaceUrl : true});
      })
  }
  
  getTipoUsuario(){
    switch(this.user.type){
      case 1: return 'Administrador';
      case 2: return 'Operario';
      case 3: return 'Técnico';
    } 
  }

}
