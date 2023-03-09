import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/galaxy/src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Instructor, InstructorItemResponse, InstructorRequest } from '../../models';

import { GlxInstructorsHttpModule } from './instructors.module';

@Injectable({
    providedIn: GlxInstructorsHttpModule
})
export class GlxInstructorsHttp {

  private api = `${environment.api}/instructors`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Instructor[]> {
    return this.http.get<InstructorItemResponse[]>(`${this.api}`)
    .pipe(
        map((instructorsResponse: InstructorItemResponse[]) => {
            return instructorsResponse.map((instructorItemResponse: InstructorItemResponse) =>  {
                return new Instructor(instructorItemResponse);
            });
        })
    );
  }

  getOne(instructorId: string): Observable<Instructor> {
    return this.http.get<InstructorItemResponse>(`${this.api}/${instructorId}`)
    .pipe(
        map((instructorResponse: InstructorItemResponse) => {
          return new Instructor(instructorResponse);
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
