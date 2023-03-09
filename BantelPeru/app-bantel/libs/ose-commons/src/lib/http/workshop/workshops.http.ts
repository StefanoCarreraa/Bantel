import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlxWorkshopsHttpModule } from './workshops.module';
import { WorkshopItemResponse, Workshop } from '../../models';
import { WorkshopRequest } from '../../models/workshop.model';
import { environment } from 'apps/ose/src/environments/environment';

@Injectable({
    providedIn: GlxWorkshopsHttpModule
})
export class GlxWorkshopsHttp {

  private api = `${environment.api}/workshops`;

  constructor(private http: HttpClient) {}

  getAllPortal(): Observable<Workshop[]> {
    return this.http.get<WorkshopItemResponse[]>(`${this.api}/portal`)
    .pipe(
        map((workshopsResponse: WorkshopItemResponse[]) => {
            return workshopsResponse.map((workshopItemResponse: WorkshopItemResponse) =>  {
                return new Workshop(workshopItemResponse);
            });
        })
    );
  }

  getAll(): Observable<Workshop[]> {
    return this.http.get<WorkshopItemResponse[]>(`${this.api}`)
    .pipe(
        map((workshopsResponse: WorkshopItemResponse[]) => {
            return workshopsResponse.map((workshopItemResponse: WorkshopItemResponse) =>  {
                return new Workshop(workshopItemResponse);
            });
        })
    );
  }

  getOne(workshopId: string): Observable<Workshop> {
    return this.http.get<WorkshopItemResponse>(`${this.api}/${workshopId}`)
    .pipe(
        map((workshopResponse: WorkshopItemResponse) => {
          return new Workshop(workshopResponse);
        })
    );
  }

  create(body: WorkshopRequest) {
    return this.http.post(`${this.api}`, body);
  }

  update(workshopId: string, body: WorkshopRequest) {
    return this.http.put(`${this.api}/${workshopId}`, body);
  }

  delete(workshopId: string) {
    return this.http.delete(`${this.api}/${workshopId}`);
  }

  updatePoster(workshopId: string, poster: File): Observable<string> {
    const body = new FormData();
    body.set('poster', poster);

    return this.http.put<{ poster: string }>(`${this.api}/${workshopId}/poster`, body)
    .pipe(
      map( (originalResponse) => originalResponse.poster )
    );
  }
}
