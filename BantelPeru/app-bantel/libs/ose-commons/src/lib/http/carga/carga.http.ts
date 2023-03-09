import { Injectable } from '@angular/core';
import { environment } from 'apps/galaxy/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CargaRequest } from '@galaxy/commons/models';
import { DhmontCargaHttpModule } from './carga.module';

@Injectable(
  {
    providedIn: DhmontCargaHttpModule
  }

)
export class DhmontCargaHttp {
  private api = `${environment.api}/api/CargaFoto`;
  constructor(private http: HttpClient) { }





  create(body: CargaRequest) {
    return this.http.post(`${this.api}`, body);
  }

  // create(body: WorkshopRequest) {
  //   return this.http.post(`${this.api}`, body);
  // }

  // update(workshopId: string, body: WorkshopRequest) {
  //   return this.http.put(`${this.api}/${workshopId}`, body);
  // }

  delete(Id: number) {
    return this.http.delete(`${this.api}/${Id}`);
  }

  // updatePoster(workshopId: string, poster: File): Observable<string> {
  //   const body = new FormData();
  //   body.set('poster', poster);

  //   return this.http.put<{ poster: string }>(`${this.api}/${workshopId}/poster`, body)
  //   .pipe(
  //     map( (originalResponse) => originalResponse.poster )
  //   );
  // }

}
