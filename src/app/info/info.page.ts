import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  public user: User;

  public centros: Array<any> = [];

  public info: Array<any> = [0,0,0,0,0,0];

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,    
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.user=this.loginService.getUser();  
    this.loadData(); 
    this.loadInfo();
  }

  /***********Menu lateral ***************************/
  go(url: string){
    this.router.navigateByUrl(url, {replaceUrl : true});
  }

  logout(){
    this.dataService.clear();    
    this.loginService.logout()
      .then( () =>{        
        this.router.navigateByUrl('/login', {replaceUrl : true});
      })
  }

  loadData(){
    let promiseUsuarios = this.dataService.getUsuarios();
    let promiseCentros= this.dataService.getCentros();
    
    Promise.all([ promiseUsuarios, promiseCentros ])
      .then( (value) => {        
        this.centros = value[1];
      })
      .catch( (err) => {        
        this.error(err);     
      })
  }

  getCentro(){    
    let centro = this.centros.find( (centro) => centro.id == this.user.centro_id );
    if(centro && centro.nombre)
      return centro.nombre;
    return '';
  }

  getTipoUsuario(){
    switch(this.user.type){
      case 1: return 'Administrador';
      case 2: return 'Operario';
      case 3: return 'Técnico';
    } 
  }
  /*************Fin menu lateral*****************/ 

  loadInfo(){
    this.showLoading( cb =>{
      this.dataService.getInfo(this.user.id)
        .then( (res) =>{
          this.loading.dismiss();          
          this.info[0]=res.data[0].num;
          this.info[1]=res.data[1].num;
          this.info[2]=res.data[2].num;
          this.info[3]=res.data[3].num;
          this.info[4]=res.data[4].num;
          this.info[5]=res.data[5].num;
        })
        .catch( (err) =>{
          this.loading.dismiss();
          this.error(err);
        })
    })
  }

  /**********Utilidades**************************/
  async showAlert(msg: string, cb: any = null){    
    var buttons: any = [ 'Aceptar' ];
    if(cb != null){
      buttons = [{
        text: 'Aceptar',
        handler: cb
      }];
    }    
    const alert = await this.alert.create({
      header: 'Atención',
      message: msg,
      buttons: buttons
    });
    await alert.present();
  } 

  error(err: any){
    if(err.status==401)
      this.showAlert('La sesión ha expirado', () =>{
        this.logout();
      }); 
    else
      this.showAlert(err.message);    
  }

  showLoading( cb: any ){
    this.loading.create({ message: 'Cargando' })
      .then( l =>{
        l.present();
        cb();
      });
  }
  

}
