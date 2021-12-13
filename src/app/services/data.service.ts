import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { StoreService } from './store.service';

import { User } from '../models/user';
import { Orden } from '../models/orden';
import { Utils } from '../models/Utils';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService {  

  private rootUrl: string = 'http://20.107.120.208:8080';

  constructor(
    private http: HttpClient,
    private login: LoginService,
    private store: StoreService,
    private util: Utils
  ) { }

  getHeader(){
    return {
      headers : new HttpHeaders({
        'Authorization': 'Bearer ' + this.login.getToken()
      })
    };
  }

  clear(){
    this.store.clear();
  }


  /*******************Users********************/
  getUser(){
    return this.login.getUser();
  }

  getUsuarios(): Promise<any>{
    const tipo = 'usuarios';
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{      
      let usuarios = this.store.getData(tipo);
      if(usuarios.length>0)
        return resolve(usuarios);
      let url = this.rootUrl+'/api/user/list';
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            let usuarios = res.data.map( (data) => this.cloneUser(data) );
            this.store.setData(tipo, usuarios);
            resolve(usuarios);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  cloneUser(user: any): User {
    return {
      id: parseInt(user.id),
      centro_id: parseInt(user.centro_id),
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
      type: parseInt(user.type)
    }
  }

  /***********************Centro******************** */
  getCentros(): Promise<any>{
    const tipo = 'centros';
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{      
      let centros = this.store.getData(tipo);
      if(centros.length>0)
        return resolve(centros);
      let url = this.rootUrl+'/api/centro/list';
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            let centros = res.data.map( (data) => this.cloneCentro(data) );
            this.store.setData(tipo, centros);
            resolve(centros);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  cloneCentro( data: any ){
    return {
      id: parseInt(data.id),
      nombre: data.nombre
    }
  }

  /************Ordenes**************************/
  getOrdenes(filtro: any): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/filter';
      this.http.post(url,{
        desde: filtro.desde,
        hasta: filtro.hasta,
        centro: filtro.centro,
        tipo: filtro.tipo,
        usuario: ((filtro.usuario==0) ? '' : filtro.usuario),
        estado: filtro.estado
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            let ordenes = res.data.map( (data) => this.cloneOrdenItem(data) );            
            resolve(ordenes);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  cloneOrdenItem(data: any){
    let tipo = 'C';
    if(data.tipo == this.util.PREVENTIVO)
      tipo = 'P';
    if(data.tipo == this.util.MEJORA)
      tipo = 'M';
    if(data.tipo == this.util.MOVIMIENTO)
      tipo = 'MJ';

    let estado = 'Pediente';
    if(data.estado == this.util.INICIADA)
      estado = 'Iniciado';
    if(data.estado == this.util.FINALIZADA)
      estado = 'Finalizada';
    if(data.estado == this.util.VALIDADA)
      estado = 'Validada';
    if(data.estado == this.util.RECHAZADA)
      estado = 'Rechazada';
    if(data.estado == this.util.DESCARTADA)
      estado = 'Descartada';

    return {
      id: data.id,
      solicitante: data.solicitante_id,
      tipo: tipo,
      estado: parseInt(data.estado),
      estado_nom: estado,
      averia: data.averia,
      fecha: ( moment(data.fecha_inicio).isValid() ? moment(data.fecha_inicio).format('DD/MM/YYYY') : '')
    }
  }

  estadoOrden(id: number, estado: number, razon: string){
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/estado/'+id;
      this.http.put(url,{
        estado: estado,
        razon: razon
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);                    
            resolve(true);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  /************************Orden*******************/

  getOrden(id: number): Promise<Orden>{
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/single/'+id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
            let orden = this.cloneOrden(res.data);                
            resolve(orden);
          },
          (err) => {            
            reject(err);
          }
        );
    }); 
  }

  cloneOrden(data: any): Orden{
    return {
      id: parseInt(data.id),
      tipo: parseInt(data.tipo),
      solicitante_id: parseInt(data.solicitante_id),
      centro_id: parseInt(data.centro_id),
      ubicacion_id: parseInt(data.ubicacion_id),
      ubicacion_nom: data.ubicacion_nom,
      maq_inst: parseInt(data.maq_inst),
      maquina_id: parseInt(data.maquina_id),
      maquina_nom: data.maquina_nom,
      instalacion_id: parseInt(data.instalacion_id),
      instalacion_nom: data.instalacion_nom,
      averia: data.averia,
      trabajo: data.trabajo,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      parada: data.parada,
      estado: parseInt(data.estado),
      razon: data.razon
    }
  }

  createOrden(orden: Orden): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/add';
      this.http.post(url,orden,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res.status);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  updateOrden(orden: Orden): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/update/'+orden.id;
      this.http.put(url,orden,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res.status);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  /************Ubicaciones*********/
  getUbicaciones(centro_id: number): Promise<any>{
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/ubicacion/list/centro/'+centro_id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
              let ubicaciones = res.data.map( (data) => this.cloneUbicacion(data) );            
              resolve(ubicaciones);
          },
          (err) => {            
            reject(err);
          }
        );
    }); 
  }

  cloneUbicacion(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.descripcion
    }
  }

  /*************Maquinas*************/
  getMaquinas(ubicacion_id: number): Promise<any>{
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/maquina/list/ubicacion/'+ubicacion_id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
              let maquinas = res.data.map( (data) => this.cloneMaquina(data) );            
              resolve(maquinas);
          },
          (err) => {            
            reject(err);
          }
        );
    }); 
  }

  cloneMaquina(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.descripcion
    }
  }

  /*************Instalaciones*************/
  getInstalaciones(centro_id: number): Promise<any>{
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/instalacion/list/centro/'+centro_id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
              let instalaciones = res.data.map( (data) => this.cloneInstalacion(data) );            
              resolve(instalaciones);
          },
          (err) => {            
            reject(err);
          }
        );
    }); 
  }

  cloneInstalacion(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.descripcion
    }
  }

  /*************Productos*************/
  getProductos(): Promise<any>{
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/producto/list/invent';
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
              let productos = res.data.map( (data) => this.cloneProducto(data) );            
              resolve(productos);
          },
          (err) => {            
            reject(err);
          }
        );
    }); 
  }

  cloneProducto(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.descripcion,
      pica: (data.picassent==null)?0:parseFloat(data.picassent),
      merca: (data.merca==null)?0:parseFloat(data.merca),
      teruel: (data.teruel==null)?0:parseFloat(data.teruel)
    }
  }

  /********Tecnicos Orden**************/
  getTecnicosOrden(id: number): Promise<any>{    
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/tecnicos/list/'+id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
            let tecnicos = res.data.map( (data) => this.cloneTecnicos(data) );            
            resolve(tecnicos);
          },
          (err) => {            
            reject(err);
          }
        );
    });     
  }

  cloneTecnicos(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.name,
      user_id: parseInt(data.user_id),
      fecha: data.fecha,
      minutos: parseInt(data.minutos)
    }
  }

  addTecnico(orden_id: number, user_id:number, fecha: any, minutos:number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/tecnicos/add';
      this.http.post(url,{
        orden_id: orden_id,
        user_id: user_id,
        fecha: fecha,
        minutos: minutos
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  updateTecnico(id: number, orden_id: number, user_id:number, fecha: any, minutos:number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/tecnicos/update/'+id;
      this.http.put(url,{
        orden_id: orden_id,
        user_id: user_id,
        fecha: fecha,
        minutos: minutos
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  deleteTecnico(id: number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/tecnicos/delete/'+id;
      this.http.delete(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  /********Productos Orden*****************/
  getProductosOrden(id: number): Promise<any>{    
    const header = this.getHeader();    
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/productos/list/'+id;
      this.http.get(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages);    
              let productos = res.data.map( (data) => this.cloneProductos(data) );            
              resolve(productos);
          },
          (err) => {            
            reject(err);
          }
        );
    });     
  }

  cloneProductos(data: any){
    return {
      id: parseInt(data.id),
      nombre: data.descripcion,
      producto_id: parseInt(data.producto_id),
      cantidad: parseFloat(data.cantidad),
      pica: (data.picassent==null)?0:parseFloat(data.picassent),
      merca: (data.merca==null)?0:parseFloat(data.merca),
      teruel: (data.teruel==null)?0:parseFloat(data.teruel)
    }
  }

  addProducto(orden_id: number, producto_id:number, cantidad:number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/productos/add';
      this.http.post(url,{
        orden_id: orden_id,
        producto_id: producto_id,
        cantidad: cantidad
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  updateProducto(id: number, orden_id: number, producto_id:number, cantidad:number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/productos/update/'+id;
      this.http.put(url,{
        orden_id: orden_id,
        producto_id: producto_id,
        cantidad: cantidad
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  deleteProducto(id: number): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/orden/productos/delete/'+id;
      this.http.delete(url,header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            resolve(res);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  /************Faltas*************/
  getFaltas(filtro: any): Promise<any>{
    const header = this.getHeader();
    return new Promise((resolve, reject) =>{            
      let url = this.rootUrl+'/api/falta/filter';
      this.http.post(url,{
        desde: filtro.desde,
        hasta: filtro.hasta,
        centro: filtro.centro,        
        usuario: ((filtro.usuario==0) ? '' : filtro.usuario)
      },header)
        .subscribe(
          (res: any)  => {
            if(res.status==500)
              return reject(res.messages); 
            let faltas = res.data.map( (data) => this.cloneFaltasItem(data) );            
            resolve(faltas);
          },
          (err) => {            
            reject(err);
          }
        );
    });
  }

  cloneFaltasItem(data: any){
    return {
      id : parseInt(data.id),
      user_id: parseInt(data.solicitante_id),
      user_nom: data.user_nom,
      centro_id: parseInt(data.centro_id),
      centro_nom: data.centro_nom,
      fecha: moment(data.created_at).format('DD/MM/YYYY'),
      productos: (data.productos)?parseFloat(data.productos):0,
      valor: (data.valor)?parseFloat(data.valor):0,
    }
  }


}
