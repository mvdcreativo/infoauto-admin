import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { SettingApiService } from '../services/setting-api.service';
import { Brand } from 'src/app/interfaces/resultado';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogBrandComponent } from './dialog-brand/dialog-brand.component';


@Component({
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  brand: Brand [];
  displayedColumns: string[] = ['id', 'name', 'image_url', 'acciones' ];
  dataSource: any;
  formAdd : FormGroup
  mostrar :boolean = false;
  urlFiles= `${environment.urlFiles}`;
  idUpdate: any;

  constructor(
    private _settingsService: SettingApiService,
    public dialog: MatDialog
  ) { }
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getBrand();
  }


  getBrand(){
    this._settingsService.getBrands().subscribe(
      (res:any) => {
        this.brand = res;
        
        this.brand.sort((a, b) => {
                  return (b.id - a.id)
                })

        this.dataSource = new MatTableDataSource(this.brand);
        this.dataSource.paginator = this.paginator;
      }
    );
  }
  

  addBrand(dataDialog:any){
    const formData = new FormData();
    let image;

    if (dataDialog[1]) {
      image = dataDialog[1][0]
    } else {
      image = "";
    }

    formData.append('image', image)
    formData.append('name', dataDialog[0].name)
    // console.log(this.selectedImage[0]);
     
    
    this._settingsService.addBrand(formData).subscribe(
      res => {
        console.log(res);
        this._settingsService.openSnackBar('success', `Tipo ${res.name} creado con éxito!!`)
        this.getBrand()
 

      },
      err => {
        console.log(err);
        
        this._settingsService.openSnackBar('error', `${err}`)
      },
    )
  }

  deleteReg(id:number){
    this._settingsService.deleteBrand(id).subscribe(
      res => {
        this._settingsService.openSnackBar('success', `Tipo "${res.name}" eliminado con éxito!!`)
        this.getBrand()
        this.formAdd.reset();
        this.mostrar = false;
      },
      err =>{
        this._settingsService.openSnackBar('success', err)

      }
    )
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  
    update(dataDialog:any) {
      const id = dataDialog[0].id
      const formData = new FormData();
      let image;

      if (dataDialog[1]) {
        image = dataDialog[1][0]
      } else {
        image = "";
      }

      
      formData.append('_method', 'PUT')
      formData.append('image', image)

      formData.append('name', dataDialog[0].name )
      
      this._settingsService.updateBrand(id, formData).subscribe(
        res => {
          console.log(res);
          this._settingsService.openSnackBar('success', `Marca ${res.name} Actualizado con éxito!!`)
          this.getBrand()
        },
        err => {
          console.log(err);
  
          this._settingsService.openSnackBar('error', `${err}`)
        },
      )
    }  









  openDialog(data?): void {
    const dialogRef = this.dialog.open(DialogBrandComponent, {
      width: '550px',
      data: {data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        if(result[0].id){
  
          this.update(result)
        }else{
          this.addBrand(result)
  
        }
      }
    });
  }
}
