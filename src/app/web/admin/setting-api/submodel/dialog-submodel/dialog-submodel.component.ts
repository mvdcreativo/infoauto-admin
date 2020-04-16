import { Component, OnInit, Inject } from '@angular/core';
import { SettingApiService } from '../../services/setting-api.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { VehicleModel, Brand, VehicleSubModel } from 'src/app/interfaces/resultado';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-submodel',
  templateUrl: './dialog-submodel.component.html',
  styleUrls: ['./dialog-submodel.component.scss']
})
export class DialogSubmodelComponent implements OnInit {
  subModel: VehicleSubModel[];
  vehicleModel: VehicleModel[];
  brands: Brand[];

  formAdd: FormGroup
  filteredOptionsBrand: Observable<Brand[]>;
  filteredOptionsModel: Observable<VehicleModel[]>;
  idUpdate: any;
  edit: boolean;
  brandId: any;


  constructor(
    private _settingsService: SettingApiService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogSubmodelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

        // this.selectBrand()
        this.brands = this.data.brand
        this.createForm()
        console.log(this.data);
    
        if(this.data.data !== undefined && this.data.data.id){
          this.openEdit(this.data.data)
          console.log(this.data);
          
        }
        if(this.data.brand !== undefined){
          // this.getModels(this.data.brand_id)
          // this.selectChangesModel()

          // console.log(this.vehicleModel);
          
          const brand = this.data.brand.filter(x=> x.id === this.data.brand_id);
          const model = brand[0].vehicle_models.filter(x=> x.id === this.data.model_id);

          
            this.formAdd.setValue(
              {
                id: null,
                name: null,
                brand_id: brand[0],
                vehicle_model_id: model[0],

              }
            )
        }
  }


  selectChangesBrand() {
    if (this.brands) {

      this.filteredOptionsBrand = this.formAdd.controls.brand_id.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.brands) : this.brands.slice())

        );
      // console.log(this.filteredOptionsBrand);

    }

  }
  selectChangesModel() {
    if (this.vehicleModel) {
      this.filteredOptionsModel = this.formAdd.controls.vehicle_model_id.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.vehicleModel) : this.vehicleModel.slice())

        );

    }


  }

  displayFn(table?: any): string | undefined {

    return table ? table.name : undefined;
  }


  private _filter(name: string, tabla: any): any[] {
    const filterValue = name.toLowerCase();

    return tabla.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ///////////////



  getModels(e: MatAutocompleteSelectedEvent) {
    this.formAdd.controls.vehicle_model_id.reset()
    console.log(e.option.value)
    this.vehicleModel = e.option.value.vehicle_models
    this.selectChangesModel()
    console.log(this.vehicleModel);
    // this._settingsService.getModelsByIDBrand(brand_id).subscribe(
    //   (res: any) => {
    //     this.vehicleModel = res.vehicle_models;
    //   }
    // );
  }

  createForm() {
    this.formAdd = this.fb.group({
      id:[null],
      name: [null, Validators.required],
      brand_id: [null, Validators.compose(
        [Validators.required, this.autocompleteObjectValidator()]
      )],
      vehicle_model_id: [null, Validators.compose(
        [Validators.required, this.autocompleteObjectValidator()]
      )],
    })
    this.selectChangesBrand()
    this.selectChangesModel()


  }


  ///////EDIT
  openEdit(element: any) {

    console.log(element);
    setTimeout(() => {
      this.formAdd.setValue(
        {
          id: element.id,
          name: element.name,
          vehicle_model_id: element.vehicle_model,
          brand_id: element.vehicle_model.brand
        }
      )
      this.idUpdate = element.id;
      this.edit = true;
    }, 100)
  }

  ////VALIDA CAMPO AUTOCOMPLETE
  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }
  ////



  enviar(){
    this.dialogRef.close(this.formAdd.value)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
