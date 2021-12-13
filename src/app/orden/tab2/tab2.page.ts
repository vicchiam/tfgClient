import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { DataService } from 'src/app/services/data.service';
import { SharingOrdenService } from 'src/app/services/sharing-orden.service';
import { AnyadirTecnicosPage } from 'src/app/modals/anyadir-tecnicos/anyadir-tecnicos.page';
import { AnyadirProductosPage } from 'src/app/modals/anyadir-productos/anyadir-productos.page';

import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  public tecnicos: Array<any> = [];
  public productos: Array<any> = [];

  constructor(
    private shareService: SharingOrdenService,
    private dataService: DataService,
    private modal: ModalController,
  ) { 
    
  }

  ngOnInit() {
    this.loadDataTecnicos();
    this.loadDataProductos();
  }

  loadDataTecnicos(){
    this.dataService.getTecnicosOrden(this.shareService.id)
      .then( (res) => {
        this.tecnicos = res;
      })
      .catch( (err) => {
        
      })
  }

  loadDataProductos(){
    this.dataService.getProductosOrden(this.shareService.id)
      .then( (res) => {
        this.productos = res;
      })
  }

  async addTecnicos(){
    const modal = await this.modal.create({
      component: AnyadirTecnicosPage,
      componentProps: { 
        id: 0,
        orden_id: this.shareService.id
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if( data.res )
      this.loadDataTecnicos();
    
  }

  async editTecnico(tecnico: any){
    const modal = await this.modal.create({
      component: AnyadirTecnicosPage,
      componentProps: { 
        id: tecnico.id,
        orden_id: this.shareService.id,
        tecnico_id: tecnico.user_id,
        fecha: tecnico.fecha,
        minutos: tecnico.minutos
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if( data.res )
      this.loadDataTecnicos();
  }

  async addProducto(){
    const modal = await this.modal.create({
      component: AnyadirProductosPage,
      componentProps: { 
        id: 0,
        orden_id: this.shareService.id,
        centro_id: this.shareService.orden.centro_id
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if( data.res )
      this.loadDataProductos();
  }

  async editProducto(producto: any){
    const modal = await this.modal.create({
      component: AnyadirProductosPage,
      componentProps: { 
        id: producto.id,
        producto_id: producto.producto_id,
        producto_nom: producto.nombre,
        orden_id: this.shareService.id,
        centro_id: this.shareService.orden.centro_id,
        cantidad: producto.cantidad,
        obj: {
          pica: producto.pica,
          merca: producto.merca,
          teruel: producto.teruel
        }
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss(); 

    if( data.res )
      this.loadDataProductos();
  }

  getDateFormat(date: any){
    return moment(date).format('DD/MM/YYYY');
  }

}
