import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab1Page } from './tab1.page';
import { Orden } from 'src/app/models/orden';
import { Utils } from 'src/app/models/Utils';

/*
describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

describe("Orden Tab1 Page", ()=>{

  let util : Utils;
  let component: Tab1Page;
  let orden : Orden

  beforeEach(()=>{
    util = new Utils();
    component = new Tab1Page(null,null,null,null,null,null,null,null,null,null);
    orden = {
      id: 0,
      tipo: util.CORRECTIVO,
      solicitante_id: 0,
      centro_id:0,
      ubicacion_id: 0,
      maq_inst: 1,
      maquina_id: null,
      instalacion_id: null,
      averia: ''
    }
  });

  it('Check Save Orden', () => {    
    expect(component.checkSave(orden)).toEqual('Debes indicar un solicitante');
    orden.solicitante_id=1;
    expect(component.checkSave(orden)).toEqual('Debes indicar un centro');
    orden.centro_id=1;
    expect(component.checkSave(orden)).toEqual('Debes indicar una ubicación');
    orden.ubicacion_id=1;
    expect(component.checkSave(orden)).toEqual('Debes indicar una máquina');
    orden.maquina_id=1;
    expect(component.checkSave(orden)).toEqual('Debes indicar una averia');
    orden.averia='Hola';
    expect(component.checkSave(orden)).toBeTrue();
  })

})
