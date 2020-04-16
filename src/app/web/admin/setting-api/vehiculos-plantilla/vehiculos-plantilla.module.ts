import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculosPlantillaRoutingModule } from './vehiculos-plantilla-routing.module';
import { VehiculosPlantillaComponent } from './vehiculos-plantilla.component';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPlantillasComponent } from './list-plantillas/list-plantillas.component';


@NgModule({
  declarations: [
    VehiculosPlantillaComponent,
    ListPlantillasComponent,
    Step1Component,
    Step2Component,
  ],
  imports: [
    CommonModule,
    VehiculosPlantillaRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class VehiculosPlantillaModule { }
