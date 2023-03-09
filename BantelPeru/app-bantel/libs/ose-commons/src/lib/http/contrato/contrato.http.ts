import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InstructorRequest } from '../../models';

import { DhmontContratoHttpModule } from './contrato.module';
import { Contrato, ContratoBusquedaRequest, ContratoResponse } from '@galaxy/commons/models/contrato.model';

@Injectable({
    providedIn: DhmontContratoHttpModule
})
export class DhmontContratoHttp {

  private api = `${environment.api}/api/contrato`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.api}/GetContratoList`);
  }

  getContratoLocalidad(body:ContratoBusquedaRequest): Observable<Contrato[]> {
    console.log(body)
    return this.http.get<Contrato[]>(`${this.api}/GetContratoList/${body.localidadNombre}`);
  }


  getcontratoxtiponodo(tiponodoid:string): Observable<Contrato[]> {

    return this.http.get<Contrato[]>(`${this.api}/GetContratoListxtiponodo/${tiponodoid}`);
  }


  getOne(contratoId: number): Observable<Contrato> {
    return this.http.get<ContratoResponse>(`${this.api}/${contratoId}`)
    .pipe(
        map((contratoResponse: ContratoResponse) => {
          return new Contrato(contratoResponse);
        })
    );
  }



  create(body: InstructorRequest) {
    return this.http.post(`${this.api}`, body);
  }

  update(instructorId: string, body: InstructorRequest) {
    return this.http.put(`${this.api}/${instructorId}`, body);
  }

  delete(instructorId: string) {
    return this.http.delete(`${this.api}/${instructorId}`);
  }


}
