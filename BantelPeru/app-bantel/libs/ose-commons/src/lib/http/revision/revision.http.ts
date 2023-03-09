import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';
import { Observable } from 'rxjs';
import { DhmontRevisionHttpModule } from './revision.module';
import { Revision, RevisionResponse } from '@galaxy/commons/models';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: DhmontRevisionHttpModule
})
export class DhmotRevisionHttp {

  private api = `${environment.api}/api/revision`;

  constructor(private http: HttpClient) {}

  getAll(ContratoId: number): Observable<Revision[]> {
    console.log(ContratoId)
    return this.http.get<RevisionResponse[]>(`${this.api}/contrato/${ContratoId}`)
    .pipe(
      map((revisionResponse: RevisionResponse[]) => {
          return revisionResponse.map((revisionResponse: RevisionResponse) =>  {
              return new Revision(revisionResponse);
          });
      })
  );
  }





}
