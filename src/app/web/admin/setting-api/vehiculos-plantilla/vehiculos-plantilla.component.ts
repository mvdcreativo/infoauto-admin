import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-vehiculos-plantilla',
  templateUrl: './vehiculos-plantilla.component.html',
  styleUrls: ['./vehiculos-plantilla.component.scss']
})
export class VehiculosPlantillaComponent implements OnInit {

  constructor() { }

  
  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX : false,
  };
  ngOnInit(): void {
  }

}
