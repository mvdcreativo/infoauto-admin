import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { VehicleModel, Brand } from 'src/app/interfaces/resultado';

@Component({
  selector: 'app-dialog-brand',
  templateUrl: './dialog-brand.component.html',
  styleUrls: ['./dialog-brand.component.scss']
})
export class DialogBrandComponent implements OnInit {
  
  formAdd : FormGroup
  edit: boolean;
  mostrar: any;
  idUpdate: any;
  imageSrc: string | ArrayBuffer;
  urlFiles= `${environment.urlFiles}`;
  selectedImage: FileList;
  categories: any;
  vehicleModel: VehicleModel[];
  brands: Brand [];
  
  
  constructor(
    public dialogRef: MatDialogRef<DialogBrandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    
    ) {}
    
    
    createForm(){
      this.formAdd = this.fb.group({
        id:[null],
        name: [null, Validators.required],
      })
    }


    
    ngOnInit(): void {
      this.createForm()


      if(this.data.data !== undefined){
        this.openEdit(this.data.data)
        console.log(this.data);
        
      }


    }
  
    enviar(){
      this.dialogRef.close([this.formAdd.value, this.selectedImage])
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  



  changeImage(e){
    
    if(e.target.files && e.target.files[0]){
      const selectedFiles = <FileList>e.target.files;
      this.selectedImage = selectedFiles;

      ///preview
      const file = selectedFiles[0]
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file)

      this.selectedImage = selectedFiles;

      console.log(selectedFiles);
      console.log(this.formAdd.value);

    }
    
  }

      
  oculta(estado) {
    this.edit = false;
    this.formAdd.reset();
    this.mostrar = estado
  }


      ///////EDIT
      openEdit(element: any) {
        this.mostrar = false;
        this.formAdd.reset();
        this.edit = false;
        this.edit = true;
        setTimeout(() => {
        this.formAdd.setValue(
          {
            id:element.id,
            name: element.name,
          }
        )
  
  
        this.idUpdate = element.id;
        this.mostrar = true;
        console.log(element);
        },500)
        if(element.image_url){
          this.imageSrc = `${this.urlFiles+element.image_url}`
        }else{
          this.imageSrc = null;
        }
      }
}
