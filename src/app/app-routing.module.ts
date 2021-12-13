import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  /*
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  */
  {
    path: 'ordenes',
    loadChildren: () => import('./ordenes/ordenes.module').then( m => m.OrdenesPageModule)
  },
  {
    path: 'orden',
    loadChildren: () => import('./orden/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'faltas',
    loadChildren: () => import('./faltas/faltas.module').then( m => m.FaltasPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'ordenes',
    loadChildren: () => import('./ordenes/ordenes.module').then( m => m.OrdenesPageModule)
  },
  {
    path: 'faltas',
    loadChildren: () => import('./faltas/faltas.module').then( m => m.FaltasPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'ordenes-filtro',
    loadChildren: () => import('./modals/ordenes-filtro/ordenes-filtro.module').then( m => m.OrdenesFiltroPageModule)
  },
  {
    path: 'seleccionar',
    loadChildren: () => import('./modals/seleccionar/seleccionar.module').then( m => m.SeleccionarPageModule)
  },
  /*
  {
    path: 'tabs',
    loadChildren: () => import('./orden/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./orden/tab1/tab1.module').then( m => m.Tab1PageModule)
  },
  {
    path: 'tab2',
    loadChildren: () => import('./orden/tab2/tab2.module').then( m => m.Tab2PageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./orden/tab3/tab3.module').then( m => m.Tab3PageModule)
  },
  */
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
