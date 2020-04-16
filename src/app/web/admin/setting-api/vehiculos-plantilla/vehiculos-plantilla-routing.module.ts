import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehiculosPlantillaComponent } from './vehiculos-plantilla.component';

import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { ListPlantillasComponent } from './list-plantillas/list-plantillas.component';



const routes: Routes = [
  {
    path: '',
    component: VehiculosPlantillaComponent,
    children: [
      {
        path: 'plantillas',
        component: ListPlantillasComponent
      },
      {
        path: 'step1/:id',
        component: Step1Component
      },
      {
        path: 'step1',
        component: Step1Component
      },
      {
        path: 'step2/:id',
        component: Step2Component
      },
      {
        path: 'step2',
        component: Step2Component
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculosPlantillaRoutingModule { }
