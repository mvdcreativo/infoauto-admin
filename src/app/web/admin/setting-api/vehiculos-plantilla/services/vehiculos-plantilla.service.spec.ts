import { TestBed } from '@angular/core/testing';

import { VehiculosPlantillaService } from './vehiculos-plantilla.service';

describe('VehiculosPlantillaService', () => {
  let service: VehiculosPlantillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculosPlantillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
