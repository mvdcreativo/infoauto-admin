import { Component, OnInit, Attribute, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Product, Attributes } from 'src/app/interfaces/product';
import { take } from 'rxjs/operators';
import { SettingApiService } from 'src/app/web/admin/setting-api/services/setting-api.service';
import { CheckboxItem } from 'src/app/shared/checkbox-group/CheckboxItem';
import { VehiculosPlantillaService } from '../../services/vehiculos-plantilla.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  attributes: any;
  subAttr: any;
  attrCheckboxes: any;
  attrCheckboxesChildren: any;
  groupCheckbox: any=[];
  plantillaAttributes: any;
  plantilla: Product;

  ///agregar attribute
  formAdd : FormGroup
  mostrar :boolean = false;
  edit: boolean;
  idUpdate: any;
  attributesSelect: Attributes[];

  //////


  constructor(
    private _settingApiServises: SettingApiService,
    private _VehiculosPlantillaService: VehiculosPlantillaService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder
    ) { 

  }
  ngOnInit() {
    this.createForm();

    this.activateRoute.params.subscribe(
      (param: Params) => {
        if (param.id) {
          this.plantilla
          this._VehiculosPlantillaService.getPlantillaById(param.id)
          this.getPlantilla()
        } else {
          this.route.navigate(['/settings-api/plantilla-vehiculos/step1'])
        }
        // console.log(param.id);
        
        this.selectAttributes();
      }
    )

    

  }

  private getPlantilla() {
    this._VehiculosPlantillaService.plantilla.subscribe(
      res => {
        this.plantilla = res
        this.selectValues()
      }
    )

  }


  ////////SUBMIT
  submitStep2() {
    const attributes = this.groupCheckbox.flat()
    console.log(attributes);
    
    const data = {'attributes': attributes}
    
    this.udatePlantilla(data);

  }



  udatePlantilla(data) {

    const status = 6;
    data.status_id = status;

    console.log(data);
    const nexStep = "/settings-api/plantilla-vehiculos/plantillas"
    return this._VehiculosPlantillaService.updatePlantilla(data, nexStep)

  }

  back(){
    const urlBack = `/settings-api/plantilla-vehiculos/step1/${this.plantilla.id}`
    this.route.navigate([urlBack]);
  }

  selectAttributes() {
    this._settingApiServises.getAttributes()
      .pipe(
        take(1)
      )
      .subscribe(
        attr => {
          this.attributes = attr
          ///para form de add attribute
          this.attributesSelect = this.attributes.filter(x=> x.attribute_id === null)
          ////
          this.attrCheckboxes = this.attributes
            .filter(x => !x.attributes.length)
            .map(
              x => {
                return new CheckboxItem(x.id, x.name)
              }
            );

          this.attrCheckboxesChildren = this.attributes
            .filter(x => x.attributes.length)
            .map(
              x => {
                let children = 
                  {
                    title: x.name,
                    attributes: x.attributes.map(x=> new CheckboxItem(x.id, x.name)),
                    multi_option: x.multi_option
                  }
                

                return children;
              }
              
            )
          
          // this.addCheckboxesAttributes()
          
            console.log();
            
        }
      );
  }

  attCheck(event, group) {
    this.groupCheckbox[group] = event;
  }


  value(valores,i){
    // console.log(this.plantillaAttributes);

    const n = valores.map(
                a => { 
                  const ch = this.plantillaAttributes.find(b => b === a.value)
                  // console.log(ch);
                  return ch
                  
                }
              )
    const che = n.filter(x=> x !== undefined)
    // this.attCheck(che[0], i)

    return che[0];
      
  }


  selectValues(){
    
    this._VehiculosPlantillaService.plantilla.pipe(take(1)).subscribe(
      res => {
        console.log(res);
        
        if(res && res.attributes.length != 0){
        this.plantillaAttributes = res.attributes.map(v=> v.id)
    //   console.log(this.plantillaAttributes);
        }else{
          this.plantillaAttributes = []
        }
      }
    )

    // const values = this._VehiculosPlantillaService.plantillaValue;
    // if(values){
    //   this.plantillaAttributes = values.attributes.map(v=> v.id)
    //   console.log(this.plantillaAttributes);
      
    // }else{
      
    //   this.plantillaAttributes = []
    // }
    
    
  }



  /////agregar attributes


  createForm(){
    this.formAdd = this.fb.group({
      attribute_id: [null],
      name: [null, Validators.required],
    })
  }

  oculta(estado) {
    this.edit = false;
    this.formAdd.reset();
    this.mostrar = estado
  }
  onSubmit(){
    this.addAttribute();
  }

  addAttribute(){
    const data = this.formAdd.value;
        
    this._settingApiServises.addAttribute(data).subscribe(
      res => {
        console.log(res);
        this._settingApiServises.openSnackBar('success', `Atributo ${res.name} creado con éxito!!`)
        this.formAdd.reset();
        this.mostrar = false;
        //recarga
        // this._VehiculosPlantillaService.getPlantillaById(this.plantilla.id)
        // this.getPlantilla()
        this.selectAttributes()
        //
      },
      err => {
        console.log(err);
        
        this._settingApiServises.openSnackBar('error', `${err}`)
      },
    )
  }
}
