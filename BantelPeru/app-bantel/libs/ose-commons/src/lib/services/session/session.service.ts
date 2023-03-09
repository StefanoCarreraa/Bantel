import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OseSessionModule } from './session.module';
import { OseCryptoService } from '../crypto/crypto.service';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: OseSessionModule
})
export class OseSession {
  private key = 'token';
  private helper = new JwtHelperService();

  get userDni() {
    return sessionStorage.getItem('userDni');
  }

  set userDni(dni: string) {
    sessionStorage.setItem('userDni', dni);
  }

  get idpersona() {
    return sessionStorage.getItem('idpersona');
  }

  set idpersona(id: string) {
    sessionStorage.setItem('idpersona', id);
  }

  get idorganizacion() {
    return sessionStorage.getItem('idorganizacion');
  }

  set idorganizacion(idorganizacion: string) {
    sessionStorage.setItem('idorganizacion', idorganizacion);
  }

  //Franklin
  //get userId() {
  get idusuariobannet() {
    return sessionStorage.getItem('idusuariobannet');
  }

  //set userId(idusuariobannet: string) {
  set idusuariobannet(idusuariobannet: string) {
    sessionStorage.setItem('idusuariobannet', idusuariobannet);
  }
  //Fin

  get token() {
    const encrypted = sessionStorage.getItem(this.key);
    return this.crypto.decrypt(encrypted);
  }

  set token(value: string) {
    const encrypted = this.crypto.encrypt(value);
    sessionStorage.setItem(this.key, encrypted);
  }

  get user(): User {
    const jwt = this.helper.decodeToken(this.token);
    return new User(jwt);
  }

  get isAuthenticated() {
    if (this.token) {
      return !this.helper.isTokenExpired(this.token);
    }

    return false;
  }

  constructor(private crypto: OseCryptoService) {
  }

  create(token: string, idusuariobannet: string, idpersona: string, idorganizacion: string) { // Estos campos se mostraran en el Local Store
    this.token = token;
    //this.userId = codigousuario;
    this.idusuariobannet = idusuariobannet;
    this.idpersona = idpersona;
    this.idorganizacion = idorganizacion;
    // En AuthHttp se guardo el userDni
  }

  destroy() {
    sessionStorage.removeItem(this.key);
    sessionStorage.removeItem('userDni');
    sessionStorage.removeItem('idusuariobannet');
    sessionStorage.removeItem('idpersona');
    sessionStorage.removeItem('idorganizacion');
  }


}
