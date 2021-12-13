import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnyadirProductosPageRoutingModule } from './anyadir-productos-routing.module';

import { AnyadirProductosPage } from './anyadir-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnyadirProductosPageRoutingModule
  ],
  declarations: [AnyadirProductosPage]
})
export class AnyadirProductosPageModule {}
