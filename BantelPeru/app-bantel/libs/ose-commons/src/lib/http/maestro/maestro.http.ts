import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {  OseMaestroHttpModule } from './maestro.module';
import { WorkshopItemResponse, Workshop } from '../../models';
import { WorkshopRequest } from '../../models/workshop.model';
import { environment } from 'apps/ose/src/environments/environment';
import { DocumentoxCobrarResponse } from '@ose/commons/models/maestro';

@Injectable({
    providedIn: OseMaestroHttpModule
})
export class OseMaestroHttp {

  private api = `${environment.api}/api`;

  constructor(private http: HttpClient) {}

  getAllDocCObrar(vdni:String): Observable<DocumentoxCobrarResponse[]> {

    // let httpParams = new HttpParams();
    // httpParams  = httpParams.append("commands", JSON.stringify({dni:dni}));

    return this.http.post<DocumentoxCobrarResponse[]>(`${environment.api}/api/DocumentoCobrar/Listar`,{ dni: vdni });
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

  GetPerfil(workshopId: string): Observable<Workshop> {
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

  ImpresionListar(obj): Observable<any[]> {
    //const body = new FormData();
    //body.set('iddoc', obj.iddoc);

    return this.http.post<any[]>(`${environment.api}/api/DocumentoCobrar/ImpresionListar`, obj);
  }

  ListarDocumentoxCliente(vdni: String): Observable<DocumentoxCobrarResponse[]> {

    // let httpParams = new HttpParams();
    // httpParams  = httpParams.append("commands", JSON.stringify({dni:dni}));

    return this.http.post<DocumentoxCobrarResponse[]>(`${environment.api}/api/DocumentoCobrar/ListarDocumentoxCliente`, { dni: vdni });
  }

  ListarComprobantexCliente(vdni: String): Observable<DocumentoxCobrarResponse[]> {

    // let httpParams = new HttpParams();
    // httpParams  = httpParams.append("commands", JSON.stringify({dni:dni}));

    return this.http.post<DocumentoxCobrarResponse[]>(`${environment.api}/api/DocumentoCobrar/ListarComprobantexCliente`, { dni: vdni });
  }

  //ListarDocxCobrar(vdni: String): Observable<DocumentoxCobrarResponse[]> {
  ListarDocxCobrar(vdni: String): Observable<any[]> {

    // let httpParams = new HttpParams();
    // httpParams  = httpParams.append("commands", JSON.stringify({dni:dni}));

    return this.http.get<any[]>(`${this.api}/DocumentoCobrar/ListarDocxCobrar/${vdni}`);
  }

  Impresion(iddoc: String): Observable<any[]> {
    //const body = new FormData();
    //body.set('iddoc', obj.iddoc);

    return this.http.get<any[]>(`${this.api}/Comprobante/Impresion/${iddoc}`);
  }

  Listar(idpersona: String): Observable<DocumentoxCobrarResponse[]> {

    // let httpParams = new HttpParams();
    // httpParams  = httpParams.append("commands", JSON.stringify({dni:dni}));

    return this.http.get<DocumentoxCobrarResponse[]>(`${this.api}/Comprobante/Listar/${idpersona}`);
  }

  ImpresionNotificacion(idDocCobrar): Observable<any[]> {
    //const body = new FormData();
    //body.set('iddoc', obj.iddoc);

    return this.http.get<any[]>(`${this.api}/DocumentoCobrar/Impresion/${idDocCobrar}`);
  }

  ListarTipoServicio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Contrato/ListarPostVenta`);
  }

  ListarContratos(idorganizacion: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Contrato/ListarContratoCliente/${idorganizacion}`);
  }

  ListarDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Ubigeo/ListarDepartamento`);
  }

  ListarProvicias(iddepartamento: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Ubigeo/ListarProvincia/${iddepartamento}`);
  }

  ListarDistritos(iddepartamento: String, idprovincia: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/Ubigeo/ListarDistrito/${iddepartamento}/${idprovincia}`);
  }
}
