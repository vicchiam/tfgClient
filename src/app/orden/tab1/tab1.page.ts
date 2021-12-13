import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { Orden } from 'src/app/models/orden';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';
import { EventsService } from 'src/app/services/events.service';
import { SharingOrdenService } from 'src/app/services/sharing-orden.service';
import { Utils } from 'src/app/models/Utils';

import { SeleccionarPage } from 'src/app/modals/seleccionar/seleccionar.page';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  public orden: Orden;

  public user: User;
  public centros: Array<any> = [];
  public usuarios: Array<User> = [];  

  constructor(
    private router: Router,    
    private loginService: LoginService,    
    private loading: LoadingController,
    private dataService: DataService,
    private alert: AlertController,
    public shareService: SharingOrdenService,
    private util: Utils,
    private modal: ModalController,
    private toast: ToastController,
    private events: EventsService
  ) { 
    
  }

  ngOnInit() {    
    this.user = this.dataService.getUser();
    this.loadData();
    
    this.orden = {
      id: 0,
      tipo: this.util.CORRECTIVO,
      solicitante_id: this.user.id,
      centro_id: 1,
      ubicacion_id: 0,
      maq_inst: 1,
      maquina_id: null,
      instalacion_id: null,
      averia: ''
    }      
    this.shareService.orden = this.orden;

    let id =  this.shareService.id;          
    this.loadOrden(id);    
  }

  ionViewWillLeave(){
    this.shareService.setFirstTab(this.orden);
  }

  loadData(){    
    this.dataService.getUsuarios()
      .then ( (res) => {
        if(this.user.type == 2){ //Solo necesito el registrado        
          let usuario = res.find( (data) => data.id == this.user.id );
          if(usuario)
            this.usuarios.push(usuario);
        } 
        else
          this.usuarios = res;
      })
    this.dataService.getCentros()
      .then( (res) => {
        this.centros = res;
      })
  } 

  loadOrden(id:number){
    if(id != 0){
      this.showLoading( () => {
        this.dataService.getOrden(id)
          .then( (res) =>{
            this.loading.dismiss();              
            this.orden = res;
            this.shareService.orden = this.orden;
          })
          .catch( (err) =>{
            this.loading.dismiss();
            this.error(err);
          })
      });
    }
  }

  seleccionarUbicacion(){
    this.showSeleccionar(this.util.UBICACION, { 'centro_id': this.orden.centro_id });
  }

  seleccionarMaquina(){
    if(this.orden.ubicacion_id==0)
      return this.showAlert('Selecciona primero una ubicación');
    this.showSeleccionar(this.util.MAQUINA, { 'ubicacion_id': this.orden.ubicacion_id });
  }

  seleccionarInstalacion(){    
    this.showSeleccionar(this.util.INSTALACION, { 'centro_id': this.orden.centro_id });
  }

  async showSeleccionar(tipo: number, params: any){        
    const modal = await this.modal.create({
      component: SeleccionarPage,
      componentProps: { 
        tipo: tipo,
        params: params
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();    
    
    if(data.res.tipo==this.util.CANCELAR) return;
    this.seleccionado(data.res.tipo, data.res.id, data.res.nombre);
  }

  seleccionado(tipo: number, id: number, nombre: string){    
    if(tipo==this.util.UBICACION){
      this.orden.ubicacion_id = id;
      this.orden.ubicacion_nom = nombre;
    }
    else if(tipo==this.util.MAQUINA){
      this.orden.maquina_id = id;
      this.orden.maquina_nom = nombre;
    }
    else if(tipo==this.util.INSTALACION){
      this.orden.instalacion_id = id;
      this.orden.instalacion_nom = nombre;
    }
  }

  save(){
    if(this.orden.solicitante_id==0)
      return this.showAlert('Debes indicar un solicitante');
    if(this.orden.centro_id==0)
      return this.showAlert('Debes indicar un centro');
    if(this.orden.ubicacion_id==0)
      return this.showAlert('Debes indicar una ubicación');
    if(this.orden.maq_inst==1 && (this.orden.maquina_id==0 || this.orden.maquina_id==null) )
      return this.showAlert('Debes indicar una máquina');
    if(this.orden.maq_inst==2 && (this.orden.instalacion_id==0 || this.orden.instalacion_id==null) )
      return this.showAlert('Debes indicar una instalación');
    if(this.orden.averia.length==0)
      return this.showAlert('Debes indicar una averia');    

    this.shareService.setFirstTab(this.orden);

    if(this.orden.id == 0){
      this.showLoading( cb =>{
        this.dataService.createOrden(this.shareService.orden)
          .then( (res) =>{
            this.loading.dismiss();
            if(res!=200)
              this.showAlert(res);
            else{
              this.showToast('Guardado correctamente');              
              this.events.publish('orden:reload', {})
              this.router.navigateByUrl('/ordenes', {replaceUrl : true});
            }
          })
          .catch( err => {
            this.loading.dismiss()
            this.error(err);
          })
      });
    }
    else{
      this.showLoading( cb =>{
        this.dataService.updateOrden(this.shareService.orden)
          .then( (res) =>{
            this.loading.dismiss();
            console.log(res);
            if(res!=200)
              this.showAlert(res.messages);
            else{
              this.showToast('Guardado correctamente');              
              this.events.publish('orden:reload', {})
              this.router.navigateByUrl('/ordenes', {replaceUrl : true});
            }
          })
          .catch( err => {
            this.loading.dismiss()            
            this.error(err);
          })
      });
    }

  }  

  /****************Utilidades********************/
  logout(){
    this.dataService.clear();    
    this.loginService.logout()
      .then( () =>{        
        this.router.navigateByUrl('/login', {replaceUrl : true});
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

  error(err: any){
    if(err.status==401)
      this.showAlert('La sesión ha expirado', () =>{
        this.logout();
      }); 
    else{
      let error = err.message || err.messages; 
      this.showAlert(error);    
    }
  }

  showToast(msg: string){
    this.toast.create({
      message: msg,
      duration: 2000
    })
    .then( t => t.present() );
  }

  showLoading( cb: any ){
    this.loading.create({ message: 'Cargando' })
      .then( l =>{
        l.present();
        cb();
      });
  }

}
