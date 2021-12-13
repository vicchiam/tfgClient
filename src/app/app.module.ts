import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Modals
import { OrdenesFiltroPageModule } from './modals/ordenes-filtro/ordenes-filtro.module';
import { SeleccionarPageModule } from './modals/seleccionar/seleccionar.module';
import { AnyadirTecnicosPageModule } from './modals/anyadir-tecnicos/anyadir-tecnicos.module';
import { AnyadirProductosPageModule } from './modals/anyadir-productos/anyadir-productos.module';
import { FaltasFiltroPageModule } from './modals/faltas-filtro/faltas-filtro.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,

    //Modals
    OrdenesFiltroPageModule,
    SeleccionarPageModule,
    AnyadirTecnicosPageModule,
    AnyadirProductosPageModule,
    FaltasFiltroPageModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
