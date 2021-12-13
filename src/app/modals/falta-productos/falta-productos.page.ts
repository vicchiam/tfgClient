import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { Utils } from 'src/app/models/Utils';
import { SeleccionarPage } from '../seleccionar/seleccionar.page';


@Component({
  selector: 'app-falta-productos',
  templateUrl: './falta-productos.page.html',
  styleUrls: ['./falta-productos.page.scss'],
})
export class FaltaProductosPage implements OnInit {

  @Input()
  public pos: number;  
  @Input()
  public centro_id: number;  
  @Input()
  public obj: any = null;

  constructor(    
    private _modal: ModalController,
    private alert: AlertController,    
    public util: Utils
  ) { }

  ngOnInit() {
    if(this.obj == null){
      this.obj = this.empty();
    }
  }

  empty(){
    return {
      id: 0,
      nombre: '',
      producto_id: 0,
      cantidad: 0,
      valor: 0,
      pica: 0,
      merca: 0,
      teruel: 0,
      vpica: 0,
      vmerca: 0,
      vteruel: 0
    }
  }

  cancelar(){
    this.dismissModal(this.util.CANCELAR);
  }

  dismissModal(tipo: number, obj: any = null){
    this._modal.dismiss({
      res: {
        pos: this.pos,
        tipo: tipo,
        obj: obj
      }
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

    if(data.res.obj==null)
      this.obj=this.empty();
    else{
      this.obj.producto_id = data.res.obj.id;
      this.obj.nombre = data.res.obj.nombre;            
      this.obj.pica = data.res.obj.pica;
      this.obj.vpica = data.res.obj.vpica;
      this.obj.merca = data.res.obj.merca;
      this.obj.vmerca = data.res.obj.vmerca;
      this.obj.teruel = data.res.obj.teruel;
      this.obj.vteruel = data.res.obj.vteruel;    
    }
  }

  delete(){    
    if(this.pos == -1)
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
            this.dismissModal(this.util.ELIMINAR);
          }
        }
      ]
    })
      .then( a => a.present() );
  }

  save(){
    if(this.obj.producto_id == 0)
      return this.showAlert('Debes indicar un producto');
    if(this.obj.cantidad <= 0)
      return this.showAlert('Debes indicar una cantidad mayor que 0');

    this.obj.valor = this.getValor(this.obj);
    
    if(this.pos == -1)
      this.dismissModal(this.util.ANYADIR, this.obj);
    else    
      this.dismissModal(this.util.ACTUALIZAR, this.obj);
  }

  getValor(data: any){
    if(this.centro_id==1)
      return data.cantidad*data.vpica;
    if(this.centro_id==2)
      return data.cantidad*data.vmerca;
    if(this.centro_id==3)
      return data.cantidad*data.vteruel;
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

}
