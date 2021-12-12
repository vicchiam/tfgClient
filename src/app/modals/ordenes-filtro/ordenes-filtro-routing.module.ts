import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenesFiltroPage } from './ordenes-filtro.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenesFiltroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenesFiltroPageRoutingModule {}
