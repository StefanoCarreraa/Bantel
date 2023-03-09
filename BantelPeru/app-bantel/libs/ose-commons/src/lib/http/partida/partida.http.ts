import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Revision, Partida } from '@galaxy/commons/models';
import { DhmontPartidaHttpModule } from './partida.module';

@Injectable({
    providedIn: DhmontPartidaHttpModule
})
export class DhmotPartidaHttp {

  private api = `${environment.api}/api/Partida`;

  constructor(private http: HttpClient) {}

  getAll(tareaId: string): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.api}`);
  }

  getNodoRevision(IdNodo: number,IdRevision: number): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.api}/${IdNodo}/${IdRevision}`);
  }
}
