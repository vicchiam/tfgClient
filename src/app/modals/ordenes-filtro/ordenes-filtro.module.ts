import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenesFiltroPageRoutingModule } from './ordenes-filtro-routing.module';

import { OrdenesFiltroPage } from './ordenes-filtro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenesFiltroPageRoutingModule
  ],
  declarations: [OrdenesFiltroPage]
})
export class OrdenesFiltroPageModule {}
