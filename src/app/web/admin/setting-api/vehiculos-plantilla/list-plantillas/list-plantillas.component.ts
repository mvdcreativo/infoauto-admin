import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { Product } from 'src/app/interfaces/product';
import { Result, DataResult } from 'src/app/interfaces/resultado';
import { VehiculosPlantillaService } from '../services/vehiculos-plantilla.service';
import { Route, Router } from '@angular/router';
import { SettingApiService } from '../../services/setting-api.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'list-plantillas',
  templateUrl: './list-plantillas.component.html',
  styleUrls: ['./list-plantillas.component.scss']
})
export class ListPlantillasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name_concat', 'year', 'state', 'price', 'acciones' ];
  plantillas: Product[];
  dataSource: any;


  constructor(
    private _plantillasService: VehiculosPlantillaService,
    private router : Router,
    private _settingsService : SettingApiService
  ) { }

  ngOnInit() {

    this.getPlantillas()

  }

  getPlantillas(){
    this._plantillasService.getPlantillas().subscribe(
      res => {
        console.log(res);
        
        this.plantillas = res.reverse();
        this.dataSource = new MatTableDataSource(this.plantillas);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  edit(row){
    console.log(row);
    this.router.navigate(['/settings-api/plantilla-vehiculos/step1', row.id])

  }


  deleteReg(id: number) {
    this._plantillasService.deletePlantilla(id).subscribe(
      res => {
        this._settingsService.openSnackBar('success', `Plantilla eliminada con éxito!!`)
        this.getPlantillas();

      },
      err => {
        this._settingsService.openSnackBar('success', err)

      }
    )
  }
}
