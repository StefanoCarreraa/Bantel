import { Injectable } from '@angular/core';
import { HttpModule } from './http.module';
import { HttpClient } from '@angular/common/http';
import { SignInCredentials } from '../../interfaces/sign-in-credentials.interface';
import { environment } from 'apps/ose/src/environments/environment';
import { Observable } from 'rxjs';
import { OseSession } from '../../../../../../../../libs/ose-commons/src/lib/services/session/session.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: HttpModule,
})
export class AuthHttp {
  constructor(private http: HttpClient, private session: OseSession) {}

  signIn(
    body: SignInCredentials
  ): Observable<{
    token: string;
    idusuariobannet: string;
    idpersona: string;
    idorganizacion: string;
  }> {
    // console.log(body)
    //return this.http.post<{ token: string }>(`${environment.api}/auth/sign-in`, body);
    this.session.userDni = body.usuario;

    console.log(body);
    return this.http.post<{
      token: string;
      idusuariobannet: string;
      idpersona: string;
      idorganizacion: string;
    }>(`${environment.api}/api/Login`, body);
  }

  signUp() {}
}
