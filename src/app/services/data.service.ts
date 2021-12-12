import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginService } from './login.service';
import { StoreService } from './store.service';

import { User } from '../models/user';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private rootUrl: string = 'http://20.107.120.208:8080';

  constructor(
    private http: HttpClient,
    private login: LoginService,
    private store: StoreService
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
      id: data.id,
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
    if(data.tipo == '2')
      tipo = 'P';
    if(data.tipo == '3')
      tipo = 'M';
    if(data.tipo == '4')
      tipo = 'MJ';

    let estado = 'Pediente';
    if(data.estado == '1')
      estado = 'Iniciado';
    if(data.estado == '2')
      estado = 'Finalizada';
    if(data.estado == '3')
      estado = 'Validada';
    if(data.estado == '4')
      estado = 'Rechazada';
    if(data.estado == '99')
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

}
