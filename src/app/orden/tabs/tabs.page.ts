import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public user: User;

  constructor(
    private lService: LoginService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user=this.lService.getUser();    
  }

  



}
