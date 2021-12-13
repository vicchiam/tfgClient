import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/user';
import { SharingOrdenService } from 'src/app/services/sharing-orden.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public id: number;
  public user: User;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,    
    private shareService: SharingOrdenService
  ) { 
    this.route.queryParams.subscribe( params => {
      this.id = this.router.getCurrentNavigation().extras.state.id;  
      this.shareService.id = this.id;
    })
  }

  ngOnInit() {
    this.user = this.loginService.getUser();
  }

}