import { Injectable } from "@angular/core";
import { environment } from "apps/ose/src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { Perfil, PerfilUpdte } from '../../models/perfil.model';

import { Mail, MailRequest } from '../../models/mail.model';


import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OseUsuarioHttpodule } from './usuario.module';
import { Workshop, WorkshopItemResponse } from "../../models";

@Injectable({
  providedIn: OseUsuarioHttpodule
})
export class OseUsuarioHttp {

  private api = `${environment.api}/api`;

  constructor(
    private http: HttpClient
  ) {}

  //getUsuario(idUsuario: number): Observable<Perfil[]> {
  //  return this.http.post(`${this.api}/Perfil/Listar`, { idUsuario: id }).pipe(map(x => x as Perfil));
  //}

  getUsuario(idorganizacion: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Perfil/Listar/${idorganizacion}`);
  }

  //updateUsuario(body: PerfilUpdte): Observable<PerfilUpdte>{
  //  return this.http.post<PerfilUpdte>(`${this.api}/Perfil/Actualizar`,body)
  //}

  updateUsuario(body: any): Observable<any> {
    return this.http.post<any>(`${this.api}/Perfil/Actualizar`, body)
  }

  enviarMail(body: MailRequest):Observable<any>{
    console.log(body);
    return this.http.post<any>(`${this.api}/Email/Send`,body);
  }

  registrarPostVenta(body): Observable<any> {
    console.log(body);
    return this.http.post<any>(`${this.api}/Contrato/RegistrarPostventa`, body);
  }

  registrarReclamo(body): Observable<any> {
    console.log(body);
    return this.http.post<any>(`${this.api}/LibroReclamacion/Registrar`, body);
  }

  solicitudPlan(body): Observable<any> {
    console.log(body);
    return this.http.post<any>(`${this.api}/SolicitudPlan/EnvioSolicitudPlan`, body);
  }
}

