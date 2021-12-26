import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

import { Orden } from 'src/app/models/orden';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';
import { EventsService } from 'src/app/services/events.service';
import { SharingOrdenService } from 'src/app/services/sharing-orden.service';
import { Utils } from 'src/app/models/Utils';

import * as moment from 'moment';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  public orden: Orden;

  constructor(
    private router: Router,    
    private loginService: LoginService,    
    private loading: LoadingController,
    private dataService: DataService,
    private alert: AlertController,
    public shareService: SharingOrdenService,
    public util: Utils,
    private modal: ModalController,
    private toast: ToastController,
    private events: EventsService
  ) { }

  ngOnInit() {
    this.orden = this.shareService.orden;
  }

  iniciar(){
    this.orden.fecha_inicio = moment().format('YYYY-MM-DD');
    this.orden.estado = this.util.INICIADA;
    this.save();
  }

  finalizar(){
    if(this.orden.trabajo.length==0)
      return this.showAlert('Para finalizar la orden debes indicar el trabajo realizado');

    this.orden.fecha_fin = moment().format('YYYY-MM-DD');
    this.orden.estado = this.util.FINALIZADA;
    this.save();
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
    if(this.orden.fecha_fin != null && this.orden.trabajo.length==0)
      return this.showAlert('Para finalizar la orden debes indicar el trabajo realizado');
    
    this.shareService.setLastTab(this.orden);

    
    this.dataService.updateOrden(this.shareService.orden)
      .then( (res) =>{          
        if(res!=200)
          this.showAlert(res);
        else{
          this.showToast('Guardado correctamente');              
          this.events.publish('orden:reload', {})
          this.router.navigateByUrl('/ordenes', {replaceUrl : true});
        }
      })
      .catch( err => {          
        this.error(err);
      })
    
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
    else
      this.showAlert( (err.message  || err.messages || err) );    
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

  getDateFormat(date: any){
    if(date)
      return moment(date).format('DD/MM/YYYY');
    return '';
  }

}
