import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { User } from '../models/user';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { EventsService } from '../services/events.service';
import { OrdenesFiltroPage } from '../modals/ordenes-filtro/ordenes-filtro.page';
import { Utils } from '../models/Utils';

import * as moment from 'moment';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.page.html',
  styleUrls: ['./ordenes.page.scss'],
})
export class OrdenesPage implements OnInit {

  public force: boolean = false;

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
    private alert: AlertController,
    private toast: ToastController,
    public util: Utils,
    private events: EventsService
  ) {
    this.events.subscribe('orden:reload',() =>{
      this.loadOrdenes();
    });
  }

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

  /***********FIN Menu lateral ***************************/

  /**********Filtro*****************************/
  initFiltro(){
    this.filtro = {
      desde: moment().subtract(15,'days').format('YYYY-MM-DD'),
      hasta: moment().add(1,'days').format('YYYY-MM-DD'),
      centro: this.user.centro_id,
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
    this.showLoading( cb =>{
      this.dataService.getOrdenes(this.filtro)
          .then( (res) =>{
            this.loading.dismiss();
            this.ordenes = res;
          })
          .catch( (err) => {       
            this.loading.dismiss(); 
            this.error(err);       
          })
    });   
  }

  validar(id: number, slidingElem: any){
    this.alert.create({
      header: 'Confirmación',
      message: '¿Esta seguro?',      
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Validar',
          handler: () => {
            this.estadoOrden(id, this.util.VALIDADA, '', slidingElem);
          }
        }
      ]
    })
      .then( a => a.present() );
  }

  rechazar(id: number, slidingElem: any){
    this.alert.create({
      header: 'Confirmación',
      message: '¿Esta seguro?',
      inputs: [
        {
          name: 'razon',
          type: 'textarea',
          placeholder: 'Razón del rechazo',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Rechazar',
          handler: (alertData) => {
            this.estadoOrden(id, this.util.RECHAZADA , alertData.razon, slidingElem);
          }
        }
      ]
    })
      .then( a => a.present() );
  }

  descartar(id: number, slidingElem: any){
    this.alert.create({
      header: 'Confirmación',
      message: '¿Esta seguro?',     
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Descartar',
          handler: () => {
            this.estadoOrden(id, this.util.DESCARTADA , '', slidingElem);
          }
        }
      ]
    })
      .then( a => a.present() );
  }

  estadoOrden(id: number, estado: number, razon: string = '', slidingElem: any){
    this.showLoading( cb => {
      this.dataService.estadoOrden(id, estado, razon)
        .then( (res) =>{
          this.loading.dismiss();
          if(res)
            this.showToast('Estado modificado correctamente');
            let ordenItem = this.ordenes.find( (data) => data.id == id );
            ordenItem.estado = estado;
            if(estado == this.util.VALIDADA)
              ordenItem.estado_nom = 'Validada';
            if(estado == this.util.RECHAZADA)
              ordenItem.estado_nom = 'Rechazada';
            if(estado == this.util.DESCARTADA)
              ordenItem.estado_nom = 'Descartada';
            slidingElem.close();            
        })
        .catch( (err) =>{
          this.loading.dismiss();
          this.error(err);
        })
    })
  }

  addOrden(){
    this.openOrden(0);
  }

  editOrden(id: number){
    this.openOrden(id);
  }

  openOrden(id: number){
    let extras: NavigationExtras = {
      state: { id: id }
    }
    this.router.navigate(['/orden'], extras);
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

}
