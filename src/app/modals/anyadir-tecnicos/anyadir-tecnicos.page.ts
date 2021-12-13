import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Utils } from 'src/app/models/Utils';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';

import * as moment from 'moment';

@Component({
  selector: 'app-anyadir-tecnicos',
  templateUrl: './anyadir-tecnicos.page.html',
  styleUrls: ['./anyadir-tecnicos.page.scss'],
})
export class AnyadirTecnicosPage implements OnInit {

  @Input()
  public id: number;
  @Input()
  public orden_id: number;
  @Input()
  public tecnico_id: any = 0;
  @Input()
  public fecha: any = moment().format('YYYY-MM-DD');
  @Input()
  public minutos: number = 0;

  public tecnicos: Array<any> = [];

  

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,
    private modal: ModalController,
    private alert: AlertController,    
    public util: Utils,
    private toast: ToastController
  ) { }

  ngOnInit() {    
    this.loadData();
  }

  loadData(){
    this.dataService.getUsuarios()
      .then( (res) =>{
        this.tecnicos = res.filter( (data) => data.type==3 );//Solo los tecnicos
      })
      .catch( (err) => this.error(err));
  }

  cancelar(){
    this.dismissModal(false);
  }

  dismissModal(exito: boolean){
    this.modal.dismiss({
      res: exito
    })
  }

  save(){
    if(this.tecnico_id==0)
      return this.showAlert('Debes indicar un técnico');
    if(this.minutos==0)
      return this.showAlert('Debes indicar una cantidad de minutos mayor que 0');

    this.showLoading( cb =>{
      if(this.id==0)
        this.dataService.addTecnico(this.orden_id, this.tecnico_id, this.fecha, this.minutos)
          .then( (res) =>{            
            this.loading.dismiss();
            if(res.status!=200)
              return this.showAlert(res.message);
            this.dismissModal(true);
          })
          .catch( (err) =>{
            this.loading.dismiss();
            this.error(err);
          })
      else
        this.dataService.updateTecnico(this.id, this.orden_id, this.tecnico_id, this.fecha, this.minutos)
          .then( (res) =>{
            this.loading.dismiss();            
            if(res.status!=200)
              return this.showAlert(res.messages);            
            this.showToast('Guardado correctamente');
            this.dismissModal(true);
          })
          .catch( (err) =>{
            this.loading.dismiss();
            this.error(err);
          })
    })
  }

  delete(){
    if(this.id==0)
      return this.cancelar();
    
    this.alert.create({
      header: 'Confirmación',
      message: '¿Esta seguro?',      
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.dataService.deleteTecnico(this.id)
              .then( (res) =>{
                if(res.status!=200)
                  return this.showAlert(res.messages);            
                this.showToast('Eliminado correctamente');
                this.dismissModal(true);
              })
              .catch( (err) => this.error(err) );
          }
        }
      ]
    })
      .then( a => a.present() );
  }

  /**********Utilidades**************************/
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
      this.showAlert(err.message);    
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
