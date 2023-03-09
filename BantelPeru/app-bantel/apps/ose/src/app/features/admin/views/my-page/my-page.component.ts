import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { OseUsuarioHttp } from '../../../../../../../../libs/ose-commons/src/lib/http/usuario/usuario.http';
import { Perfil,PerfilUpdte } from '../../../../../../../../libs/ose-commons/src/lib/models/perfil.model';
import { OseSession } from '../../../../../../../../libs/ose-commons/src/lib/services/session/session.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { finalize, subscribeOn } from 'rxjs/operators';
import { OseLoadingComponent } from '@ose/commons/components';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {Message,MessageService} from 'primeng/api';

@Component({
  selector: 'app-my-page',
  providers: [MessageService],
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.scss']
})
export class MyPageComponent implements OnInit {


  //usuario?: Perfil;
  usuario: any;
  //plan?: Perfil;
  plan: any[] = [];
  idusuariobannet: string;
  id_persona: any
  dataPlan: any
  idorganizacion: any


  constructor(
    private messageService: MessageService,
    private usuarioHttp: OseUsuarioHttp,
    private session: OseSession,
    private dialog: MatDialog,
    private router: Router,

  ) {
    this.idusuariobannet = this.session.idusuariobannet;
    this.id_persona=this.session.idpersona;
    this.idorganizacion = this.session.idorganizacion;

  }


  ngOnInit(): void {
    // this.uInformation.value
    this.usuarioHttp.getUsuario(this.idorganizacion).subscribe(
      perfil => {
        // console.log(perfil[0])
        this.usuario= perfil[0];
        this.plan = perfil;
        console.log('1111111111:Usuario: ', this.usuario )
      }
    );
  }


  //userUpdate(body:PerfilUpdte) {
  userUpdate(body: any) {
    console.log('body1:::: ', body)
    //body.idusuario=(Number)(this.userId)
    body.idUsuarioBannet = (Number)(this.idusuariobannet)
    console.log('body2:::: ', body)
    const loading = this.dialog.open(OseLoadingComponent, { disableClose: true });
    this.usuarioHttp.updateUsuario(body)
    .pipe(finalize(() => loading.close()))
    .subscribe(_ => this.showViaService());
  }

  goHome(){
    this.router.navigateByUrl('/administrador/home');
  }

  showViaService() {
    this.messageService.add({severity:'success', summary:'Bantel Perú', detail:'Se actualizaron los datos correctamente'});
  }
}
