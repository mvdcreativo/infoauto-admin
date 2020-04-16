import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingApiService } from '../services/setting-api.service';
import { VehicleSubModel, Brand, VehicleModel } from 'src/app/interfaces/resultado';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { startWith, map } from 'rxjs/operators';
import { DialogSubmodelComponent } from './dialog-submodel/dialog-submodel.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './submodel.component.html',
  styleUrls: ['./submodel.component.scss']
})
export class SubmodelComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'brand', 'model', 'image_url', 'acciones'];
  subModel: VehicleSubModel[];
  vehicleModel: VehicleModel[];
  brands: Brand[];
  dataSource: any;
  urlFiles = `${environment.urlFiles}`;


  
  idUpdate: any;
  edit: boolean;

  constructor(
    private _settingsService: SettingApiService,
    private fb: FormBuilder,
    private dialog: MatDialog
    ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.getSubModel()
    this.selectBrand()
  }


  addSubModel(dataDialog:any) {
    const data = {
      model_id: dataDialog.vehicle_model_id.id,
      name: dataDialog.name
    }

    console.log(data);

    this._settingsService.addSubModel(data).subscribe(
      res => {
        console.log(res);
        this._settingsService.openSnackBar('success', `Sub-Modelo ${res.name} creado con éxito!!`)
        this.getSubModel()

      },
      err => {
        console.log(err);

        this._settingsService.openSnackBar('error', `${err}`)
      },
    )
  }




  getSubModel() {
    this._settingsService.getSubModel().subscribe(
      (res: any) => {
        this.subModel = res.reverse();
        this.dataSource = new MatTableDataSource(this.subModel);
        this.dataSource.paginator = this.paginator;

      }
    );
  }

 
  update(dataDialog:any) {
    const id = dataDialog.id
    const data = {
      model_id: dataDialog.vehicle_model_id.id,
      name: dataDialog.name
    }

    console.log(data);

    this._settingsService.updateSubModel(id, data).subscribe(
      res => {
        console.log(res);
        this._settingsService.openSnackBar('success', `Sub Modelo ${res.name} Actualizado con éxito!!`)
        this.getSubModel()
        this.idUpdate = null;
      },
      err => {
        console.log(err);

        this._settingsService.openSnackBar('error', `${err}`)
      },
    )
  }

 
  //////////

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteReg(id: number) {
    this._settingsService.deleteSubModel(id).subscribe(
      res => {
        this._settingsService.openSnackBar('success', `Modelo "${res.name}" eliminado con éxito!!`)
        this.getSubModel()

      },
      err => {
        this._settingsService.openSnackBar('success', err)

      }
    )
  }



  /// INPUT SELECT MARCA autocomplete
  selectBrand() {
    this._settingsService.getBrands().subscribe(
      (brands: any) => {
        this.brands = brands

        // console.log(brands)
      }
    );
  }




  openDialog(brand,data?): void {


    const dialogRef = this.dialog.open(DialogSubmodelComponent, {
      width: '700px',
      data: {brand,data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        if(result.id){
  
          this.update(result)
        }else{
          this.addSubModel(result)
  
        }
      }
    });
  }
}
