import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Brand } from 'src/app/interfaces/resultado';
import { SettingApiService } from '../../services/setting-api.service';
import { Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-model',
  templateUrl: './dialog-model.component.html',
  styleUrls: ['./dialog-model.component.scss']
})
export class DialogModelComponent implements OnInit {
  brands: Brand[];
  edit: boolean;
  idUpdate: any;
  brandId: any;

  constructor(
    private fb: FormBuilder,
    private _settingsService: SettingApiService,
    public dialogRef: MatDialogRef<DialogModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  formAdd: FormGroup
  mostrar: boolean = false;
  filteredOptions: Observable<Brand[]>;


  ngOnInit() {
    // this.selectBrand()
    this.brands = this.data.brand
    this.createForm()
    console.log(this.data);

    if(this.data.data !== undefined && this.data.data.id){
      this.openEdit(this.data.data)
      console.log(this.data);
      
    }
    if(this.data.data !== undefined){
      this.brandId = this.data.data.idBrand
      const brand = this.data.brand.filter(x=> x.id === this.data.data);
      console.log(brand[0]);
      
        this.formAdd.setValue(
          {
            id: null,
            name: null,
            brand_id: brand[0]
          }
        )
    }
    
  }

  createForm() {
    this.formAdd = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      brand_id: [null, Validators.compose(
        [Validators.required, this.autocompleteObjectValidator()]
      )]
    })
    this.selectChanges()
  }

  /// INPUT SELECT MARCA autocomplete
  selectBrand() {
    this._settingsService.getBrands().subscribe(
        (brands: any) => {
          // this.brands = brands
          this.createForm();
          
          console.log(brands)
        }
      );
  }


  selectChanges(){
    if(this.brands){
      this.filteredOptions = this.formAdd.controls.brand_id.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.brands.slice())
        
      );
    }
  }


  displayFn(brand?: Brand): string | undefined {
    return brand ? brand.name : undefined;
  }

  private _filter(name: string): Brand[] {
    const filterValue = name.toLowerCase();

    return this.brands.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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






   ///////EDIT
   openEdit(element: any) {
    this.mostrar = false;
    this.formAdd.reset();
    this.edit = false;
    this.edit = true;
    setTimeout(() => {
    this.formAdd.setValue(
      {
        id: element.id,
        name: element.name,
        brand_id: element.brand
      }
    )
    this.idUpdate = element.id;
    this.mostrar = true;
    console.log(element);
    },500)
  }

  oculta(estado) {
    this.edit = false;
    this.formAdd.reset();
    this.mostrar = estado
  }
  //////////



  enviar(){
    this.dialogRef.close(this.formAdd.value)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
