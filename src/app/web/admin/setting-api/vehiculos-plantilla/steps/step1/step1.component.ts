import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { VehicleCategory, Brand, VehicleModel, VehicleSubModel, NameConcat } from 'src/app/interfaces/resultado';
import { Product } from 'src/app/interfaces/product';
import { SettingApiService } from 'src/app/web/admin/setting-api/services/setting-api.service';
import { VehiculosPlantillaService } from '../../services/vehiculos-plantilla.service';
import { DialogBrandComponent } from '../../../brands/dialog-brand/dialog-brand.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogModelComponent } from '../../../models-vehicles/dialog-model/dialog-model.component';
import { DialogSubmodelComponent } from '../../../submodel/dialog-submodel/dialog-submodel.component';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  formStep1: FormGroup;
  data: any;
  categories: VehicleCategory[];
  brands: Brand[];
  models: VehicleModel[];
  subModels: VehicleSubModel[];
  nameConcat: NameConcat = {brand_id: null,vehicle_model_id: null,vehicle_sub_model_id: null};
  categoryId: number;
  brandId: number;
  conditions: any;
  precios: any = [];
  anos: any[];
  currencies: any;
  priceCondition: any;
  priceConditions: any;
  plantilla: Product;
  update: boolean = false;
  cilindradas: any[];
  modelId: any;

  constructor(
    private _settingApiServises: SettingApiService,
    private _VehiculosPlantillaService: VehiculosPlantillaService,
    private _authService: AuthService,
    private _fb: FormBuilder,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      (param: Params) => {
        if (param.id) {
          this._VehiculosPlantillaService.getPlantillaById(param.id)
          this.getPlantilla();

        } else {
          this.route.navigate(['/settings-api/plantilla-vehiculos/step1'])
        }
        // console.log(param.id);
        
      }
    )
    this.generaFormStep1()
  }

  private getPlantilla() {


    this._VehiculosPlantillaService.plantilla.subscribe(
      res =>{ 
        this.plantilla = res

        if(this.formStep1){
          this.selectModel(this.plantilla.brand_id);
          this.selectSubModel(this.plantilla.vehicle_model_id);

          this.formStep1.setValue({
            user_id: this.plantilla.user_id,
            vehicle_category_id: this.plantilla.vehicle_category_id,
            brand_id: this.plantilla.brand_id,
            vehicle_model_id: this.plantilla.vehicle_model_id,
            vehicle_sub_model_id: this.plantilla.vehicle_sub_model_id,
            year: this.plantilla.year,
            cilindrada: this.plantilla.cilindrada,
            status_id: this.plantilla.status_id,


          });
          this.brandId = this.plantilla.brand_id

        }
        this.update = true;

      }
    )
  }


  private generaFormStep1() {
    const user: User = this._authService.currentUserValue.user

    this.formStep1 = this._fb.group({
      user_id: user.id,
      vehicle_category_id: [1, Validators.required],
      brand_id: [null, Validators.required],
      vehicle_model_id: [null, Validators.required],
      vehicle_sub_model_id: [null],
      year: [null],
      cilindrada: [null],
      status_id: ['1'],

    });

    this.selectCategory()
    this.selectBrand()
    this.selectAnos()
    this.selectCondition()
    this.selectPrecios()
    this.selectCurrency()
    this.selectPriceCondition()
  }


  submitStep1() {


    this.data = this.formStep1.value
    console.log(this.data);
    

    // if (this.data.vehicle_category_id) {
    //   this.idToSlug('vehicle_category_id', this.categories)
    // }
    if (this.data.brand_id) {
      this.idToSlug('brand_id', this.brands , this.data)
    }
    if (this.data.vehicle_model_id) {
      this.idToSlug('vehicle_model_id', this.models , this.data)
    }
    if (this.data.vehicle_sub_model_id) {
      this.idToSlug('vehicle_sub_model_id', this.subModels, this.data)
    }
    // this.cleanObjet(this.data)
    console.log(this.nameConcat);

    this.data.name_concat = `${this.nameConcat.brand_id} ${this.nameConcat.vehicle_model_id} ${this.nameConcat.vehicle_sub_model_id}`;

    console.log(this.data);


////actualiza o agrega
    if(this.update){
      const nexStep = "/settings-api/plantilla-vehiculos/step2"

      return this._VehiculosPlantillaService.updatePlantilla(this.data, nexStep)

    }else{
      return this._VehiculosPlantillaService.addPlantilla(this.data)

    }


  }



  idToSlug(campo: string, arrCampo: any, data) {

    let campoSlug = arrCampo.filter(item => item.id == data[campo])
    this.nameConcat[campo] = `${campoSlug[0].name}`

  }

  changeCategory(e) {
    this.categoryId = e;
    this.selectBrand();
    // console.log(this.categoryId);
  }
  changeBrand(e) {
    if (e === undefined) {
      this.models = [];
      console.log(this.formStep1.value);

      this.formStep1.patchValue({
        vehicle_model_id: ''
      })
    } else {
      this.brandId = e;
      this.formStep1.patchValue({
        vehicle_model_id: ''
      })
      this.selectModel(this.brandId);
      // console.log(this.brandId);
    }
  }
  changeModel(e) {
    let modelId;
    if (e === undefined) {
      this.subModels = [];
      // console.log(this.formStep1.value);

      this.formStep1.patchValue({
        vehicle_sub_model_id: ''
      })
    } else {
      modelId = e;
      this.formStep1.patchValue({
        vehicle_sub_model_id: ''
      })
      this.modelId = modelId
      this.selectSubModel(modelId);
      // console.log(this.brandId);
    }
  }

  selectCategory() {
    return this._settingApiServises.getCategory()
      .subscribe(
        (category: any) => {
          
          this.categories = category
          // console.log(this.categories);
        }
      )
  }

  selectBrand() {
    return this._settingApiServises.getBrands()
    .subscribe(
      (res:any)=>{
        this.brands = res

      }
    )

  }

  selectModel(brandId: number) {
    return this._settingApiServises.getModelsByIDBrand(brandId)
      .subscribe(
        (res: any) => {
          this.models = res.vehicle_models
          // console.log(this.models)        
        }
      );
  }
  selectSubModel(modelId){
    return this._settingApiServises.getSubModelByModelId(modelId)
    .subscribe(
      (res: any) => {
        this.subModels = res.veicle_sub_models
        // console.log(this.models)        
      }
    );
  }

  selectCondition() {
    this.conditions = this._settingApiServises.getCondition()
  }

  onConditionChanged({value}){
    if (value === 2) {
      this.formStep1.get('km').enable()
      this.formStep1.controls['km'].setValidators(Validators.required)

    } else {
      this.formStep1.get('km').disable()
    }
  }

  selectPrecios() {
    let value = 0
    let arrprecios = Array(35);
    for (let i = 0; i < arrprecios.length; i++) {
      value = value + 100000;
      this.precios.push({ 'value': value, 'option': value });
    }
    // let json= JSON.stringify(this.precios)
    // console.log(this.precios);
  }

  selectAnos() {
    let anos = [];
    let anoAct = new Date().getFullYear();
    for (let i = 1930; i <= anoAct +1 ; i++) {

      anos.push({ 'value': i, 'option': i });
    }
    this.anos = anos.reverse();
    // console.log(this.anos);
  }
  selectCurrency() {
    this.currencies = this._settingApiServises.getCurrencies()
  }
  selectPriceCondition() {
    this.priceConditions = this._settingApiServises.getPriceConditions()
  }









///////////ADD
///add Brand
openDialogBrand(data?): void {
  const dialogRef = this.dialog.open(DialogBrandComponent, {
    width: '550px',
    data: {data}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if(result){
      
        this.addBrand(result)

      }
    
  });
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
  
  
  this._settingApiServises.addBrand(formData).subscribe(
    res => {
      console.log(res);
      this._settingApiServises.openSnackBar('success', `Tipo ${res.name} creado con éxito!!`)
      this.selectBrand()
      this.formStep1.patchValue(
        {
          brand_id: res.id
        }
      )
      this.changeBrand(res.id)

    },
    err => {
      console.log(err);
      this._settingApiServises.openSnackBar('error', `${err}`)
    },
  )
}
////////////////////


///add Model
openDialogModel(brand): void {

  const data = this.brandId;
  const dialogRef = this.dialog.open(DialogModelComponent, {
    width: '550px',
    data: {data,brand}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if(result){

        this.addModel(result)

      
    }
  });
}

addModel(dataDialog:any) {
  const data = {
    brand_id : dataDialog.brand_id.id,
    name: dataDialog.name
  }

  console.log(data);
  
  this._settingApiServises.addModel(data).subscribe(
    res => {
      console.log(res);
      this._settingApiServises.openSnackBar('success', `Modelo ${res.name} creado con éxito!!`)
      this.selectModel(this.brandId)
      this.formStep1.patchValue(
        {
          vehicle_model_id: res.id
        }
      )
      this.changeModel(res.id)
    },
    err => {
      console.log(err);

      this._settingApiServises.openSnackBar('error', `${err}`)
    },
  )
}
////////////////////

////add SubModel
openDialogSubModel(brand,brand_id,model_id): void {


  const dialogRef = this.dialog.open(DialogSubmodelComponent, {
    width: '700px',
    data: {brand,brand_id,model_id}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(result);
    if(result){
      if(result.id){

        // this.update(result)
      }else{
        this.addSubModel(result)

      }
    }
  });
}
addSubModel(dataDialog:any) {
  const data = {
    model_id: dataDialog.vehicle_model_id.id,
    name: dataDialog.name
  }

  console.log(data);

  this._settingApiServises.addSubModel(data).subscribe(
    res => {
      console.log(res);
      this._settingApiServises.openSnackBar('success', `Sub-Modelo ${res.name} creado con éxito!!`)
      this.selectSubModel(data.model_id)
      this.formStep1.patchValue(
        {
          vehicle_sub_model_id: res.id
        }
      )

    },
    err => {
      console.log(err);

      this._settingApiServises.openSnackBar('error', `${err}`)
    },
  )
}
//////////////////


}
