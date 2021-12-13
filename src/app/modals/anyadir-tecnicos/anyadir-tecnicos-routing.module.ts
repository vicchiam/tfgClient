import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnyadirTecnicosPage } from './anyadir-tecnicos.page';

const routes: Routes = [
  {
    path: '',
    component: AnyadirTecnicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnyadirTecnicosPageRoutingModule {}
