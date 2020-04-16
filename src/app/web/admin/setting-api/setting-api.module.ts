import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingApiRoutingModule } from './setting-api-routing.module';
import { TipoVehicleComponent } from './tipo-vehicle/tipo-vehicle.component';
import { BrandsComponent } from './brands/brands.component';
import { ModelsComponent } from './models-vehicles/models.component';
import { SubmodelComponent } from './submodel/submodel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttributesComponent } from './attributes/attributes.component';
import { ExtrasComponent } from './extras/extras.component';
import { VehiculosPlantillaComponent } from './vehiculos-plantilla/vehiculos-plantilla.component';
import { Step1Component } from './vehiculos-plantilla/steps/step1/step1.component';
import { Step2Component } from './vehiculos-plantilla/steps/step2/step2.component';
import { DialogBrandComponent } from './brands/dialog-brand/dialog-brand.component';
import { DialogModelComponent } from './models-vehicles/dialog-model/dialog-model.component';
import { DialogSubmodelComponent } from './submodel/dialog-submodel/dialog-submodel.component';

@NgModule({
  declarations: [
    TipoVehicleComponent, 
    BrandsComponent, 
    ModelsComponent, 
    SubmodelComponent, 
    AttributesComponent, 
    ExtrasComponent, DialogBrandComponent, DialogModelComponent, DialogSubmodelComponent, 

  ],
  imports: [
    CommonModule,
    SettingApiRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SettingApiModule { }
