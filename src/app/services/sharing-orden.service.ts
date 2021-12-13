import { Injectable } from '@angular/core';
import { Orden } from '../models/orden';
import { Utils } from '../models/Utils';

@Injectable({
  providedIn: 'root'
})
export class SharingOrdenService {

  public id: number;
  public orden: Orden;  

  constructor(
    private util: Utils
  ) { }

  setFirstTab(data: Orden){
    this.orden.solicitante_id = data.solicitante_id;
    this.orden.centro_id = data.centro_id;
    this.orden.tipo = data.tipo;
    this.orden.ubicacion_id = data.ubicacion_id;
    this.orden.ubicacion_nom = data.ubicacion_nom;
    this.orden.maq_inst = data.maq_inst;
    if(this.orden.maq_inst == 1){
      this.orden.maquina_id = data.maquina_id;
      this.orden.maquina_nom = data.maquina_nom;
      this.orden.instalacion_id = null;
      this.orden.instalacion_nom = '';
    }
    if(this.orden.maq_inst == 2){
      this.orden.maquina_id = null;
      this.orden.maquina_nom = '';
      this.orden.instalacion_id = data.instalacion_id;
      this.orden.instalacion_nom = data.instalacion_nom;
    }
    this.orden.averia = data.averia;
    this.orden.estado = ( (data.estado)?data.estado: this.util.PENDIENTE );
  }

  setLastTab(data: Orden){
    this.orden.fecha_inicio = data.fecha_inicio;
    this.orden.fecha_fin = data.fecha_fin;
    this.orden.parada = data.parada;
    this.orden.trabajo = data.trabajo;
  }

}
