import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlxParticipantHttpModule } from './participant.module';

@Injectable({
    providedIn: GlxParticipantHttpModule
})
export class GlxParticipantHttp {

  private api = `${environment.api}/participants`;

  constructor(private http: HttpClient) {}

  register(workshopId: string, register: boolean): Observable<void> {
    return this.http.post<void>(`${this.api}`, { workshop: workshopId, register });
  }

}
