import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { OrdenesFiltroPage } from '../modals/ordenes-filtro/ordenes-filtro.page';

import * as moment from 'moment';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {

  public user: User;
  public filtro: any = {}; 

  public centros: Array<any> = []; 
  public ordenes: Array<any> = [];

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,
    private modal: ModalController,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.user=this.loginService.getUser();    
    this.loadData();
    this.initFiltro();
    this.loadOrdenes();
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
        if(err.status==401)
          this.showAlert('La sesión ha expirado', () =>{
            this.logout();
          } );        
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

  /***********FIN Menu lateral ***************************/

  /**********Filtro*****************************/
  initFiltro(){
    this.filtro = {
      desde: moment().subtract(15,'days').format('YYYY-MM-DD'),
      hasta: moment().add(1,'days').format('YYYY-MM-DD'),
      centro: this.user.centro_id+'',
      estado: '',       
      usuario: ((this.user.type==2) ? this.user.id : 0),
      tipo: ''
    };    
  } 

  async showFiltro(){        
    const modal = await this.modal.create({
      component: OrdenesFiltroPage,
      componentProps: { filtro: this.filtro }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();    

    this.filtro = data.filtro;
    this.loadOrdenes();
  }  

  /**********Ordenes **************************/

  loadOrdenes(){
    this.dataService.getOrdenes(this.filtro)
      .then( (res) =>{
        this.ordenes = res;
      })
      .catch( (err) => {        
        if(err.status==401)
          this.showAlert('La sesión ha expirado', () =>{
            this.logout();
          } );        
      })
  }

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

  editOrden(id: number){
    
  }

}
