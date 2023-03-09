import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';


import { DhmontExcelLargoHttpModule } from './excel-largo.module';
import { NodoExcel, NodoExcelResponse } from '@galaxy/commons/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: DhmontExcelLargoHttpModule
})
export class DhmontExcelLargoHttp {

  private api = `${environment.api}/api/ReporteExcelLargo`;

  constructor(private http: HttpClient) {}


  getAll(): Observable<NodoExcel[]> {

    return this.http.get<NodoExcelResponse[]>(`${this.api}/Nodo`)
    .pipe(
      map((revisionResponse: NodoExcelResponse[]) => {
          return revisionResponse.map((revisionResponse: NodoExcelResponse) =>  {
            console.log(revisionResponse);
              return new NodoExcel(revisionResponse);
          });
      })
  );
  }
  getOne(nodoId: number): Observable<NodoExcelResponse> {
    return this.http.get<NodoExcelResponse>(`${this.api}/${nodoId}`);
  }

  descargarExcel(): Observable<any> {
    return this.http.get(`${this.api}`,{responseType: 'blob'});
  }




  // create(body: InstructorRequest) {
  //   return this.http.post(`${this.api}`, body);
  // }

  update( body: NodoExcel) {
    console.log(body)
    return this.http.post(`${this.api}`, body);
  }

  // delete(instructorId: string) {
  //   return this.http.delete(`${this.api}/${instructorId}`);
  // }


}
