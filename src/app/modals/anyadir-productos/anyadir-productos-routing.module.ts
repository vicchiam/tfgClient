import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnyadirProductosPage } from './anyadir-productos.page';

const routes: Routes = [
  {
    path: '',
    component: AnyadirProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnyadirProductosPageRoutingModule {}
