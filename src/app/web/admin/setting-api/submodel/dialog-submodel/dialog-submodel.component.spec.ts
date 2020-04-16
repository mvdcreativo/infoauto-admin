import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubmodelComponent } from './dialog-submodel.component';

describe('DialogSubmodelComponent', () => {
  let component: DialogSubmodelComponent;
  let fixture: ComponentFixture<DialogSubmodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSubmodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
