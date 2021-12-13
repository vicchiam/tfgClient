import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaltaProductosPage } from './falta-productos.page';

const routes: Routes = [
  {
    path: '',
    component: FaltaProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaltaProductosPageRoutingModule {}
