import { Injectable } from '@angular/core';
import { OseSession } from '@ose/commons/services';
import { Router } from '@angular/router';

@Injectable()
export class AdminPresenter {


  get name() {
    return this.session.user.fullName;
  }


  constructor(
    private session: OseSession,
    private router: Router
  ) { }

  closeSession() {
    this.session.destroy();
    this.router.navigateByUrl('autenticacion/ingresar');
  }
}
