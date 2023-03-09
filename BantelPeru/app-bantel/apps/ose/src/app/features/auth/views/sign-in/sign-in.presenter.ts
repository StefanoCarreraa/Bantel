import { Injectable } from '@angular/core';
import { AuthHttp } from '../../commons/http/auth.http';
import { MatDialog } from '@angular/material/dialog';
import { OseLoadingComponent } from '@ose/commons/components';
import { SignInCredentials } from '../../interfaces/sign-in-credentials.interface';
import { finalize } from 'rxjs/operators';
import { OseSession } from '@ose/commons/services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class SignInPresenter {
  display: boolean = false;

  constructor(
    private messageService: MessageService,
    private authHttp: AuthHttp,
    private dialog: MatDialog,
    private session: OseSession,
    private router: Router
  ) {}

  signIn(credentials: SignInCredentials) {
    console.log(credentials);
    const loading = this.dialog.open(OseLoadingComponent, {
      disableClose: true,
    });
    this.authHttp
      .signIn(credentials)
      .pipe(finalize(() => loading.close()))
      .subscribe((res) => {
        this.session.create(
          res.token,
          res.idusuariobannet,
          res.idpersona,
          res.idorganizacion
        );
        console.log(res); // Devuelve todos los datos en sesion
        //temporal - mala practica
        if (res.token != null) {
          this.router.navigateByUrl('/administrador');
          console.log('ok');
        } else {
          console.log('');
          this.showViaService();
        }
      });
  }
  showViaService() {
    this.messageService.add({
      severity: 'error',
      summary: 'Bantel Perú',
      detail: 'Se actualizaron los datos correctamente',
    });
  }
}
