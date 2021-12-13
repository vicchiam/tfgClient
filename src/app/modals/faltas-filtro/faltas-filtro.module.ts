import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaltasFiltroPageRoutingModule } from './faltas-filtro-routing.module';

import { FaltasFiltroPage } from './faltas-filtro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaltasFiltroPageRoutingModule
  ],
  declarations: [FaltasFiltroPage]
})
export class FaltasFiltroPageModule {}
