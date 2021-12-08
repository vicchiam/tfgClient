import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user: string = 'Admin';
  public password: string = 'pass123word';

  constructor(
    private lService: LoginService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  doLogin(){
    this.lService.login(this.user, this.password)
      .then( res => {
        this.router.navigateByUrl('/ordenes');
      })
      .catch(err => {
        this.alert(err);
      })
  }

  async alert(msg: string){
    const alert = await this.alertController.create({
      header: 'Atención',
      message: msg,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

}
