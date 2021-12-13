import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/services/data.service';
import { SharingOrdenService } from 'src/app/services/sharing-orden.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {

  public tecnicos: Array<any> = [];

  constructor(
    private shareService: SharingOrdenService,
    private dataService: DataService,
  ) { 
    
  }

  ngOnInit() {
    this.dataService.getTecnicos(this.shareService.id)
      .then( (res) => {
        this.tecnicos = res;
      })
      .catch( (err) => {
        
      })
  }

}
