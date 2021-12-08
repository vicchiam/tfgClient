import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaltasPageRoutingModule } from './faltas-routing.module';

import { FaltasPage } from './faltas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaltasPageRoutingModule
  ],
  declarations: [FaltasPage]
})
export class FaltasPageModule {}
