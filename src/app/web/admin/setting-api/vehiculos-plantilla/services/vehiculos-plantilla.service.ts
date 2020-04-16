import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product,  } from 'src/app/interfaces/product';
import { environment } from 'src/environments/environment';
import { Image } from 'src/app/interfaces/resultado';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class VehiculosPlantillaService {

  public plantillaSubject$: BehaviorSubject<Product> = new BehaviorSubject<Product>(null);
  public plantilla: Observable<Product>;

  constructor(
    private _http: HttpClient,
    private route: Router,
    private _authService : AuthService

  ) {

    this.plantilla = this.plantillaSubject$.asObservable();
    console.log(this.plantillaValue);
    
  }


  public get plantillaValue(): Product {
    return this.plantillaSubject$.value;
  }

  ////Recupera Publicación
  getPlantillaById(id:number){
    return this._http.get<Product>(`${environment.API}product/${id}`).pipe(
      take(1)
    ).subscribe(
      res =>{
        this.plantillaSubject$.next(res)
        console.log(this.plantillaValue);
        
      },
    )
  }


  ///guarda primera vez publicación y queda como pendiente hasta el último Step
  addPlantilla(data) {
    return this._http.post<Product>(`${environment.API}product`, data).pipe(
      take(1)
    ).subscribe(
      res => {
        this.plantillaSubject$.next(res)
        console.log(res)
        this.route.navigate(['/settings-api/plantilla-vehiculos/step2', res.id ])
      },
      error => { console.log(error) }
    )
  }

  ///Actualiza publicación con cada Step que la llama
  updatePlantilla(data: Product, step: string) {
    
    const plantillaId = this.plantillaValue.id
    const nexStep = `${step}/${plantillaId}`
    if(plantillaId){
      console.log(nexStep);
      return this._http.put<Product>(`${environment.API}product/${plantillaId}`, data).pipe(
        take(1)
      ).subscribe(
        res => {
          this.plantillaSubject$.next(res)
          console.log(res)
              if(step==="/settings-api/plantilla-vehiculos/plantillas"){
                this.route.navigate([step])
              }else{
                this.route.navigate([step, plantillaId])

              }
        },
        error => { console.log(error) }
      )

    }


  }
  


  uploadProductImage(plantillaID: number, files: FileList, index?: number) {

    const formData = new FormData();
    console.log(files);

    for (let i = 0; i < files.length; i++) {
      formData.append('images[]', files[i])
      // formData.append("_method", "PUT")
    }

    formData.append("_method", "PUT")

    return this._http.post(`${environment.API}product/${plantillaID}`, formData, {
      observe: 'events',
      reportProgress: true
    })
  }

  updateImage(data){
    data.map(
      d => this._http.put(`${environment.API}image/${d.id}`, d).pipe(take(1)).subscribe()
    )
  }

  removeImageId(imageID) {
    return this._http.delete<Image>(`${environment.API}image/${imageID}`)
    .pipe(take(1))
    .subscribe(
      
      res=> {
        console.log(res);
        this.plantillaSubject$.next(res.products[0])
      }
    );
  }
  // getPlantilla(){
  //   return
  // }



  getPlantillas(){
     return this._http.get<Product[]>(`${environment.API}plantillas`).pipe(
      take(1)
    )
  }

  deletePlantilla(id){
    
      return this._http.delete<Product>(`${environment.API}product/${id}`).pipe(
        take(1)
      )
    
  }
}
