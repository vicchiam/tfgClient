import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaltasPage } from './faltas.page';

const routes: Routes = [
  {
    path: '',
    component: FaltasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaltasPageRoutingModule {}
