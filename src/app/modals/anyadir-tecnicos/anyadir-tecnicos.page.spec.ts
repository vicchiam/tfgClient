import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnyadirTecnicosPage } from './anyadir-tecnicos.page';

describe('AnyadirTecnicosPage', () => {
  let component: AnyadirTecnicosPage;
  let fixture: ComponentFixture<AnyadirTecnicosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnyadirTecnicosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnyadirTecnicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
