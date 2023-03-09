import { Injectable } from '@angular/core';
import { DhmontTareaHttpModule } from './tareas.module';
import { environment } from 'apps/galaxy/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, TareaBusquedaRequest, TareaResponse, CargaRequest, CargaResponse } from '@galaxy/commons/models';
import { map } from 'rxjs/operators';

@Injectable(
  {
    providedIn: DhmontTareaHttpModule
  }

)
export class DhmontTareaHttp {
  private api = `${environment.api}/api/tareas`;
  constructor(private http: HttpClient) { }



  // getAll(ContratoId: string): Observable<Revision[]> {
  //   console.log(ContratoId)
  //   return this.http.get<RevisionResponse[]>(`${this.api}/contrato/${ContratoId}`)
  //   .pipe(
  //     map((revisionResponse: RevisionResponse[]) => {
  //         return revisionResponse.map((revisionResponse: RevisionResponse) =>  {
  //             return new Revision(revisionResponse);
  //         });
  //     })
  // );
  // }

  descargarExcel(contrato:String): Observable<any> {
    return this.http.get(`${this.api}/excel/${contrato}`,{responseType: 'blob'});
  }
  descargarFoto(contrato:String): Observable<any> {
    return this.http.get(`${this.api}/fotos/${contrato}`,{responseType: 'blob'});
  }



  getAll(body: TareaBusquedaRequest): Observable<Tarea[]> {
    return this.http.get<TareaResponse[]>(`${this.api}/${body.contrato}/${body.revision}/${body.partida}`)
      .pipe(
        map((tareaResponse: TareaResponse[]) => {
          return tareaResponse.map((tareaResponse: TareaResponse) => {
            return new Tarea(tareaResponse);
          });
        })
      );
  }

  // getOne(TareaId: string): Observable<Tarea> {
  //   return this.http.get<Tarea>(`${this.api}/${TareaId}`);
  // }
  getOne(TareaId: string): Observable<Tarea> {
    return this.http.get<TareaResponse>(`${this.api}/${TareaId}`)
    .pipe(
        map((tareaResponse: TareaResponse) => {
          return new Tarea(tareaResponse);
        })
    );
  }


  // create(body: WorkshopRequest) {
  //   return this.http.post(`${this.api}`, body);
  // }

  // update(workshopId: string, body: WorkshopRequest) {
  //   return this.http.put(`${this.api}/${workshopId}`, body);
  // }

  // delete(workshopId: string) {
  //   return this.http.delete(`${this.api}/${workshopId}`);
  // }

  // updatePoster(workshopId: string, poster: File): Observable<string> {
  //   const body = new FormData();
  //   body.set('poster', poster);

  //   return this.http.put<{ poster: string }>(`${this.api}/${workshopId}/poster`, body)
  //   .pipe(
  //     map( (originalResponse) => originalResponse.poster )
  //   );
  // }

}
