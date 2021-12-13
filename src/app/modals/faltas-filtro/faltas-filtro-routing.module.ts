import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaltasFiltroPage } from './faltas-filtro.page';

const routes: Routes = [
  {
    path: '',
    component: FaltasFiltroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaltasFiltroPageRoutingModule {}
