import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private appName = 'contrataciones';

  constructor() { }

  getData(type: string): any{
    const name = this.appName+'-'+type;    
    if( localStorage.getItem(name) ){
      return JSON.parse( localStorage.getItem(name) || '' );
    }
    return [];
  }

  setData(type: string, data: any): void {
    if(!data || data.length==0)
      return;       
    const name = this.appName+'-'+type;    
    localStorage.setItem(name, JSON.stringify(data) );    
  }  

  removeData(type: string){
    const name = this.appName+'-'+type;    
    localStorage.removeItem(name);
  }

  clear(){
    localStorage.clear();
  }

}
