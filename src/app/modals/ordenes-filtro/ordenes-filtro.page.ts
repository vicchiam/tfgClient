import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { DataService } from 'src/app/services/data.service';

import { User } from 'src/app/models/user';

@Component({
  selector: 'app-ordenes-filtro',
  templateUrl: './ordenes-filtro.page.html',
  styleUrls: ['./ordenes-filtro.page.scss'],
})
export class OrdenesFiltroPage implements OnInit {

  @Input()
  public filtro: any = {}  
  
  public user: User;
  public centros: Array<any> = [];
  public usuarios: Array<User> = [];

  constructor(    
    private modal: ModalController,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadData();    
  }

  dismissModal(){
    this.modal.dismiss({
      'filtro': this.filtro
    })
  }

  loadData(){
    this.user = this.dataService.getUser();
    this.dataService.getUsuarios()
      .then ( (res) => {
        if(this.user.type == 2){ //Solo necesito el registrado        
          let usuario = res.find( (data) => data.id == this.user.id );
          if(usuario)
            this.usuarios.push(usuario);
        } 
        else//Solo necesito los que no son operarios
          this.usuarios = res.filter( (data) => data.type != 2 );
      })
    this.dataService.getCentros()
      .then( (res) => {
        this.centros = res;
      })
  } 

}
