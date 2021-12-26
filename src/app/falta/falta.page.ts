import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Utils } from '../models/Utils';

import { DataService } from '../services/data.service';
import { LoginService } from '../services/login.service';
import { EventsService } from '../services/events.service';
import { User } from '../models/user';

import { FaltaProductosPage } from '../modals/falta-productos/falta-productos.page';

@Component({
  selector: 'app-falta',
  templateUrl: './falta.page.html',
  styleUrls: ['./falta.page.scss'],
})
export class FaltaPage implements OnInit {

  public id: number;
  public falta: any = {
    id: 0,
    solicitante_id: 0,
    centro_id: 1     
  }

  public productos: Array<any> = [];

  public user: User;
  public centros: Array<any> = [];
  public usuarios: Array<User> = [];  

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private loginService: LoginService,
    private dataService: DataService,
    private loading: LoadingController,
    private modal: ModalController,
    private alert: AlertController,
    private toast: ToastController,
    public util: Utils,
    private events: EventsService
  ) { 
    if(this.route && this.route.queryParams){
      this.route.queryParams.subscribe( params => {
        if(this.router.getCurrentNavigation().extras.state){
          this.id = this.router.getCurrentNavigation().extras.state.id;
        }
      })
    }
  }

  ngOnInit() {
    this.user = this.dataService.getUser();
    this.falta = this.emptyFalta();
    this.loadData();
    this.loadFalta();
  }

  emptyFalta(){
    return {
      id: this.id,
      solicitante_id: this.user.id,
      centro_id: 1     
    }
  }

  loadData(){    
    this.dataService.getUsuarios()
      .then ( (res) => {        
        this.usuarios = res.filter( (data) => data.type != 2 );//Solo necesito tecnicos
      })
    this.dataService.getCentros()
      .then( (res) => {
        this.centros = res;
      })
  } 

  loadFalta(){
    if(this.falta.id==0) 
      return;
    
    let p1 = this.dataService.getFalta(this.falta.id);
    let p2 = this.dataService.getProductosFalta(this.falta.id);

    this.showLoading( cb =>{
      Promise.all([ p1, p2 ])
        .then( (value) => {                  
          this.loading.dismiss();
          this.falta = value[0];
          this.productos = value[1];
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);     
        })
    })
  }

  loadDataProductos(){
    this.showLoading( cb =>{
      this.dataService.getProductosFalta(this.falta.id)
        .then( (res) => {                  
          this.loading.dismiss();          
          this.productos = res;
        })
        .catch( (err) => {       
          this.loading.dismiss(); 
          this.error(err);     
        })
    })
  }

  async addProducto(){
    const modal = await this.modal.create({
      component:FaltaProductosPage,
      componentProps: { 
        pos: -1,
        centro_id: this.falta.centro_id
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if(data.res.tipo == this.util.ANYADIR){
      this.productos.push(data.res.obj);  
    }    
    
  }

  async editProducto(pos: number){
    const modal = await this.modal.create({
      component: FaltaProductosPage,
      componentProps: { 
        pos: pos,
        centro_id: this.falta.centro_id,
        obj: this.productos[pos]
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if(data.res.tipo == this.util.ACTUALIZAR){      
      let pos = data.res.pos;
      this.productos[pos]=data.res.obj;
    }
    else if(data.res.tipo == this.util.ELIMINAR){
      let pos = data.res.pos;
      this.productos.splice(pos,1);
    }
  }

  checkSave(falta){
    if(falta.solicitante_id==0)
      return 'Debes indicar un solicitante';
    if(falta.centro_id==0)
      return 'Debes indicar un centro';
    if(falta.productos.length==0)
      return 'Debes indicar al menos 1 producto';
    return true;
  }

  save(){
    this.falta.productos = this.productos;

    let resCheck = this.checkSave(this.falta);
    if(resCheck!==true)
      return this.showAlert(resCheck);    

    this.dataService.saveFalta(this.falta)
      .then( (res)=>{
        this.showToast('Guardado correctamente');              
        this.events.publish('falta:reload', {})
        this.router.navigateByUrl('/faltas', {replaceUrl : true});
      })
      .catch( (err) =>{
        this.error(err);
      })

  }

  delete(){
    if(this.falta.id==0)
      return this.router.navigateByUrl('/faltas', {replaceUrl : true});

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
            this.dataService.deleteFalta(this.falta.id)
            .then( (res) =>{
              this.showToast('Eliminado correctamente');              
              this.events.publish('falta:reload', {})
              this.router.navigateByUrl('/faltas', {replaceUrl : true});
            })
            .catch( (err) =>{
              this.error(err);
            })
          }
        }
      ]
    })
      .then( a => a.present() );  
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

  logout(){
    this.dataService.clear();    
    this.loginService.logout()
      .then( () =>{        
        this.router.navigateByUrl('/login', {replaceUrl : true});
      })
  }

  showLoading( cb: any ){
    this.loading.create({ message: 'Cargando' })
      .then( l =>{
        l.present();
        cb();
      });
  }

}
