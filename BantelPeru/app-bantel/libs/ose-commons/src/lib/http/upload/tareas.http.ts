import { Injectable } from '@angular/core';
import { environment } from 'apps/galaxy/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea, TareaBusquedaRequest, TareaResponse, CargaRequest, CargaResponse } from '@galaxy/commons/models';
import { map } from 'rxjs/operators';
import { DhmontUploadHttpModule } from './tareas.module';

@Injectable(
  {
    providedIn: DhmontUploadHttpModule
  }

)
export class DhmontUploadHttp {
  private api = `${environment.api}/api/Upload`;
  constructor(private http: HttpClient) { }

  updatePoster(string, poster: File): Observable<string> {
    const body = new FormData();
    body.set('poster', poster);

    return this.http.put<{ poster: string }>(`${this.api}/All`, body)
      .pipe(
        map((originalResponse) => originalResponse.poster)
      );
  }

  //   this.http.post(`${environment.api}/api/Upload/All`, formData, {reportProgress: true, observe: 'events'})
  //     .subscribe(event =>{
  //       if (event.type === HttpEventType.UploadProgress)
  //         this.progress = Math.round(100 * event.loaded / event.total);
  //       else if (event.type === HttpEventType.Response) {
  //         this.message = 'Upload success.';
  //         this.onUploadFinished.emit(event.body);
  //       }
  //     });
  // }

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




  // getOne(TareaId: string): Observable<Tarea> {
  //   return this.http.get<Tarea>(`${this.api}/${TareaId}`);
  // }



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
