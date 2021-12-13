import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaltaProductosPageRoutingModule } from './falta-productos-routing.module';

import { FaltaProductosPage } from './falta-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaltaProductosPageRoutingModule
  ],
  declarations: [FaltaProductosPage]
})
export class FaltaProductosPageModule {}
