import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private appName = 'gmao';

  constructor() { }

  getData(type: string): any{
    const name = this.appName+'-'+type;    
    let now = new Date().getTime();
    let old = parseInt(localStorage.getItem(name+'-time') || '0' ) ;
    if( ((now-old)/1000) < (3600*2) ) //Hace menos de 2 horas
        return JSON.parse( localStorage.getItem(name) || '{}' );        
    return [];
  }

  getDataPermanent(type: string): any{
    const name = this.appName+'-'+type;    
    if( localStorage.getItem(name) )
      return JSON.parse( localStorage.getItem(name) || '{}' );    
    return null;
  }

  setData(type: string, data: any): void {
    if(!data || data.length==0)
      return;       
    const name = this.appName+'-'+type;    
    localStorage.setItem(name, JSON.stringify(data) );
    localStorage.setItem(name+'-time', new Date().getTime().toString());    
  }  

  removeData(type: string){
    const name = this.appName+'-'+type;    
    localStorage.removeItem(name);
  }

  clear(){
    localStorage.clear();
  }

}
