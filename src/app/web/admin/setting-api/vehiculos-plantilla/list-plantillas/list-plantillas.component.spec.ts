import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlantillasComponent } from './list-plantillas.component';

describe('ListPlantillasComponent', () => {
  let component: ListPlantillasComponent;
  let fixture: ComponentFixture<ListPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
