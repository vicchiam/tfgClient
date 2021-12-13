import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras  } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { EventsService } from '../services/events.service';
import { Utils } from '../models/Utils';

import { FaltasFiltroPage } from '../modals/faltas-filtro/faltas-filtro.page';

import * as moment from 'moment';

@Component({
  selector: 'app-faltas',
  templateUrl: './faltas.page.html',
  styleUrls: ['./faltas.page.scss'],
})
export class FaltasPage implements OnInit {

  public user: User;
  public filtro: any = {}; 

  public centros: Array<any> = [];

  public faltas: Array<any> = [];

  constructor(    
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,
    private modal: ModalController,
    private alert: AlertController,
    private toast: ToastController,
    public util: Utils,
    private events: EventsService
  ) {
    this.events.subscribe('falta:reload',() =>{
      this.loadFaltas();
    });
   }

  ngOnInit() {
    this.user=this.loginService.getUser();  
    this.loadData();
    this.initFiltro();
    this.loadFaltas();
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

  /**********Filtro*****************************/
  initFiltro(){
    this.filtro = {
      desde: moment().subtract(15,'days').format('YYYY-MM-DD'),
      hasta: moment().add(1,'days').format('YYYY-MM-DD'),
      centro: this.user.centro_id,      
      usuario: this.user.id
      
    };    
  } 

  async showFiltro(){        
    const modal = await this.modal.create({
      component:FaltasFiltroPage,
      componentProps: { filtro: this.filtro }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();    

    this.filtro = data.filtro;
    this.loadFaltas();
  }  

  loadFaltas(){
    this.showLoading( cb =>{
      this.dataService.getFaltas(this.filtro)
        .then( (res) =>{
          this.loading.dismiss();
          this.faltas = res;
        })
        .catch( (err) => {
          this.loading.dismiss();
          this.error(err);
        })
    });
  }

  addFalta(){
    this.openFalta(0);
  }

  editFalta(id: number){
    this.openFalta(id);
  }

  openFalta(id: number){
    let extras: NavigationExtras = {
      state: { id: id }
    }
    this.router.navigate(['/falta'], extras);
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

  showToast(msg: string){
    this.toast.create({
      message: msg,
      duration: 2000
    })
    .then( t => t.present() );
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

  firstLetter(text: string){
    return text.substring(0,1);
  }



}
