import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Utils } from 'src/app/models/Utils';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-seleccionar',
  templateUrl: './seleccionar.page.html',
  styleUrls: ['./seleccionar.page.scss'],
})
export class SeleccionarPage implements OnInit {  

  @Input()
  public tipo: number;
  @Input()
  public params: any;

  public key: string = '';
  public data: Array<any> = [];
  public filterData: Array<any> = [];

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,
    private modal: ModalController,
    private alert: AlertController,    
    public util: Utils
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    if(this.tipo == this.util.UBICACION)
      this.loadUbicaciones();
    else if(this.tipo == this.util.MAQUINA)
      this.loadMaquinas();
    else if(this.tipo == this.util.INSTALACION)
      this.loadInstalaciones();
    else if(this.tipo == this.util.PRODUCTO)
      this.loadProductos();
  }

  loadUbicaciones(){
    this.showLoading( cb =>{
      this.dataService.getUbicaciones(this.params.centro_id)
        .then( (res) => {
          this.loading.dismiss(); 
          this.data = res;
          this.filterData = Object.assign([], this.data);
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);       
        })
    });
  }

  loadMaquinas(){
    this.showLoading( cb =>{
      this.dataService.getMaquinas(this.params.ubicacion_id)
        .then( (res) => {
          this.loading.dismiss(); 
          this.data = res;
          this.filterData = Object.assign([], this.data);
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);       
        })
    });
  }

  loadInstalaciones(){
    this.showLoading( cb =>{
      this.dataService.getInstalaciones(this.params.centro_id)
        .then( (res) => {
          this.loading.dismiss(); 
          this.data = res;
          this.filterData = Object.assign([], this.data);
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);       
        })
    });
  }

  loadProductos(){
    this.showLoading( cb =>{
      this.dataService.getProductos()
        .then( (res) => {
          this.loading.dismiss(); 
          this.data = res;
          this.filterData = Object.assign([], this.data);
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);       
        })
    });
  }

  setFilter(evt: any){
    let value = evt.target.value.toLowerCase();
    if(value == '')
      this.filterData = Object.assign([], this.data);
    else
      this.filterData = this.data.filter( (data) => data.nombre.toLowerCase().includes(value) );
  }

  seleccionar(data: any){    
    this.dismissModal(this.tipo, data.id, data.nombre, data);
  }

  cancelar(){
    this.dismissModal(this.util.CANCELAR, 0, '');
  }

  limpiar(){
    this.dismissModal(this.tipo, 0, '');
  }

  dismissModal(tipo: number, id: number, nombre: string, obj: any = null){
    this.modal.dismiss({
      res: {
        tipo: tipo,
        id: id,
        nombre: nombre,
        obj : obj
      }
    })
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

  showLoading( cb: any ){
    this.loading.create({ message: 'Cargando' })
      .then( l =>{
        l.present();
        cb();
      });
  }

}
