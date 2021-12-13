import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnyadirTecnicosPageRoutingModule } from './anyadir-tecnicos-routing.module';

import { AnyadirTecnicosPage } from './anyadir-tecnicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnyadirTecnicosPageRoutingModule
  ],
  declarations: [AnyadirTecnicosPage]
})
export class AnyadirTecnicosPageModule {}
