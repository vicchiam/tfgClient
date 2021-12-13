import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Utils } from 'src/app/models/Utils';
import { DataService } from 'src/app/services/data.service';
import { LoginService } from 'src/app/services/login.service';

import { SeleccionarPage } from '../seleccionar/seleccionar.page';

@Component({
  selector: 'app-anyadir-productos',
  templateUrl: './anyadir-productos.page.html',
  styleUrls: ['./anyadir-productos.page.scss'],
})
export class AnyadirProductosPage implements OnInit {

  @Input()
  public orden_id: number;
  @Input()
  public centro_id: number;
  @Input()
  public id: number;
  @Input()
  public producto_id: number = 0;
  @Input()
  public producto_nom: string = '';
  @Input()
  public cantidad: number = 0;
  @Input()
  public obj: any = {
    pica: 0,
    merca: 0,
    teruel: 0
  };

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private router: Router,
    private loading: LoadingController,
    private _modal: ModalController,
    private alert: AlertController,    
    public util: Utils,
    private toast: ToastController
  ) { }

  ngOnInit() {
  }

  cancelar(){
    this.dismissModal(false);
  }

  dismissModal(exito: boolean){
    this._modal.dismiss({
      res: exito
    })
  }

  async seleccionarPieza(){    
    const modal = await this._modal.create({
      component: SeleccionarPage,
      componentProps: { 
        tipo: this.util.PRODUCTO,
        params: null
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if(data.res.tipo==this.util.CANCELAR) return;

    this.producto_id = data.res.id;
    this.producto_nom = data.res.nombre;
    this.obj = data.res.obj;
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
            this.dataService.deleteProducto(this.id)
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

  save(){
    if(this.producto_id == 0)
      return this.showAlert('Debes indicar un producto');
    if(this.cantidad <= 0)
      return this.showAlert('Debes indicar una cantidad mayor que 0');
    
    let actual = this.obj.pica;
    if(this.centro_id == 2)
      actual = this.obj.merca;
    if(this.centro_id == 3)
      actual = this.obj.teruel;

    if( this.cantidad > actual )
      return this.showAlert('No dispones de suficiente stock de producto en el centro actual');

      this.showLoading( cb =>{
        if(this.id == 0)
          this.dataService.addProducto(this.orden_id, this.producto_id, this.cantidad)
            .then((res) =>{
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
        else
            this.dataService.updateProducto( this.id, this.orden_id, this.producto_id, this.cantidad)
            .then((res) =>{
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
      });

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
