import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosPlantillaComponent } from './vehiculos-plantilla.component';

describe('VehiculosPlantillaComponent', () => {
  let component: VehiculosPlantillaComponent;
  let fixture: ComponentFixture<VehiculosPlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiculosPlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculosPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
