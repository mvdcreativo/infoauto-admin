import { Component, OnInit, ViewChild } from '@angular/core';

import { SettingApiService } from '../services/setting-api.service';
import { VehicleModel, Brand } from 'src/app/interfaces/resultado';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from './dialog-model/dialog-model.component';



@Component({
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'brand', 'image_url', 'acciones'];
  vehicleModel: VehicleModel[];
  dataSource: any;
  urlFiles = `${environment.urlFiles}`;

  mostrar: boolean = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  edit: boolean;
  idUpdate: number;
  brands: Brand[];
  
  constructor(
    private _settingsService: SettingApiService,
    private dialog: MatDialog
  ) { }



  ngOnInit() {
    this.selectBrand()
    this.getModels();
  }

  selectBrand() {
    this._settingsService.getBrands().subscribe(
        (brands: any) => {
          this.brands = brands
          
          console.log(brands)
        }
      );
  }

  addModel(dataDialog:any) {
    const data = {
      brand_id : dataDialog.brand_id.id,
      name: dataDialog.name
    }

    console.log(data);
    
    this._settingsService.addModel(data).subscribe(
      res => {
        console.log(res);
        this._settingsService.openSnackBar('success', `Modelo ${res.name} creado con éxito!!`)
        this.getModels()
        this.mostrar = false;
      },
      err => {
        console.log(err);

        this._settingsService.openSnackBar('error', `${err}`)
      },
    )
  }

  deleteReg(id: number) {
    this._settingsService.deleteModel(id).subscribe(
      res => {
        this._settingsService.openSnackBar('success', `Modelo "${res.name}" eliminado con éxito!!`)
        this.getModels()
        this.mostrar = false;
      },
      err => {
        this._settingsService.openSnackBar('success', err)

      }
    )
  }

  getModels() {
    this._settingsService.getModels().subscribe(
      (res: any) => {
        this.vehicleModel = res.reverse();
        this.dataSource = new MatTableDataSource(this.vehicleModel);
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  ////////

  update(dataDialog: any) {
    const id = dataDialog.id;
    const data = {
      brand_id : dataDialog.brand_id.id,
      name: dataDialog.name
    }
    console.log(data);
    
    this._settingsService.updateModel(id, data).subscribe(
      res => {
        console.log(res);
        this._settingsService.openSnackBar('success', `Modelo ${res.name} Actualizado con éxito!!`)
        this.getModels()
        this.idUpdate = null;
      },
      err => {
        console.log(err);
        this._settingsService.openSnackBar('error', `${err}`)
      },
    )
  }  
  


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  openDialog(brand,data?): void {


    const dialogRef = this.dialog.open(DialogModelComponent, {
      width: '550px',
      data: {data,brand}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        if(result.id){
  
          this.update(result)
        }else{
          this.addModel(result)
  
        }
      }
    });
  }

}
