import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaltaPage } from './falta.page';

/*
describe('FaltaPage', () => {
  let component: FaltaPage;
  let fixture: ComponentFixture<FaltaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaltaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaltaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/

describe("Falta Page", ()=>{

  let component: FaltaPage;
  let falta : any

  beforeEach(()=>{    
    component = new FaltaPage(null,null,null,null,null,null,null,null,null,null);
    falta = {
      id: 0,
      solicitante_id: 0,
      centro_id: 0 ,
      productos: []
    }
  });

  it('Check Save Falta', () => {    
    expect(component.checkSave(falta)).toEqual('Debes indicar un solicitante');
    falta.solicitante_id=1;
    expect(component.checkSave(falta)).toEqual('Debes indicar un centro');
    falta.centro_id=1;
    expect(component.checkSave(falta)).toEqual('Debes indicar al menos 1 producto');
    falta.productos.push(1)
    expect(component.checkSave(falta)).toBeTrue();
  })

})
