import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { OseUsuarioHttp } from '../../../../../../../../libs/ose-commons/src/lib/http/usuario/usuario.http';
import { Mail,MailRequest } from '../../../../../../../../libs/ose-commons/src/lib/models/mail.model';

import {Message,MessageService, PrimeNGConfig} from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { OseMaestroHttp } from '../../../../../../../../libs/ose-commons/src/lib/http/maestro/maestro.http';
import { finalize } from 'rxjs/operators';
import { OseSession } from '../../../../../../../../libs/ose-commons/src/lib/services/session/session.service';
import { OseLoadingComponent } from '@ose/commons/components';

@Component({
  selector: 'app-postventa',
  templateUrl: './postventa.component.html',
  providers: [MessageService],
  styleUrls: ['./postventa.component.scss']
})
export class PostventaComponent implements OnInit {

  //public model: MailRequest;
  loading: boolean = true;

  //categories: any[] = [
  //  {name: 'Reubicacion de sintonizador (DECO/IPTV)', key: 'A'},
  //  {name: 'Reubicacion dentro de condominio (Reubicacion de ONT)', key: 'M'},
  //  {name: 'Reubicacion de SET TOP BOX', key: 'P'},
  //  {name: 'Reubicacion en residencial (Reubicacion de ONT)', key: 'R'},
  //  {name: 'Recojo de Equipos (Modem)', key: 'R'},
  //  {name: '1 Punto adicional de TV', key: 'R'},
  //  {name: '1 Punto adicional de red s/canaleta', key: 'R'},
  //  {name: '1 Punto adicional de red c/canaleta', key: 'R'},

  //  {name: 'Instalación (Reposición) de SET TOP BOX (Sintonizador)', key: 'R'},
  //  {name: 'Reposición de SET TOP BOX', key: 'R'},
  //  {name: 'Reposición de Control Remoto (Deco o SET TOP BOX)', key: 'R'},
  //  {name: 'Reposición de ONT', key: 'R'},
  //  {name: 'Cambio PACH CORD', key: 'R'},
  //  {name: 'Cambio de ACOMETIDA', key: 'R'}
  //];

  //nombres: string = '';
  //dni: string = '';
  //telefono: string = '';
  //email: string='';
  selectedCategory: any = null;
  selectedContrato: any = null;
  cuerpo: string = '';
  mensaje: string
  categories: any[] = [];
  contratos: any[] = [];
  idorganizacion: string;
  addMensaje: boolean;
  flag: number = 0;

  constructor(private usuarioHttp: OseUsuarioHttp, private messageService: MessageService, public dialog_: MatDialog, private http: OseMaestroHttp, private session: OseSession,
    private primengConfig: PrimeNGConfig  ) {
    this.idorganizacion = this.session.idorganizacion;
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    const loading1 = this.dialog_.open(OseLoadingComponent, { disableClose: true });
    this.http.ListarContratos(this.idorganizacion)
      .pipe(finalize(() => loading1.close()))
      .subscribe(
        (Data) => {
          this.contratos = Data;

          const loading2 = this.dialog_.open(OseLoadingComponent, { disableClose: true });
          this.http.ListarTipoServicio()
            .pipe(finalize(() => loading2.close()))
            .subscribe(
              (Data) => {
                this.categories = Data;
              },
              (err) => {
                console.log(err);
              }
            );
        },
        (err) => {
          console.log(err);
        }
    );
  }

  showViaService() {
    this.messageService.add({severity:'success', summary:'Bantel Perú', detail:'Se realizó el envío de su solicitud'});
  }

  getSelected() {
    console.log(this.selectedCategory)
    console.log(this.selectedContrato)
    if (this.selectedContrato == null) {
      alert('Seleccione un contrato')
      return
    }

    if (this.selectedCategory == null) {
      alert('Seleccione un tipo de servicio')
      return
    }

    if (this.cuerpo.trim() == '') {
      alert('Escriba un detalle de solicitud')
      return
    }

    var rpta = confirm("¿Desea enviar solicitud?");
    if (rpta == true) {
      console.log('SI desea enviar solicitud')
      //this.model = new MailRequest(this.email,'Solicitud de Postventa',this.cuerpo,this.selectedCategory.name ,this.nombres,this.dni,this.telefono);
      //this.model = new MailRequest('Solicitud de Postventa', this.selectedContrato.IDServicioContratado, this.selectedCategory.DescripcionCategoriaTicket, this.cuerpo.trim());
      let obj = {
        IDServicioContratado: this.selectedContrato.IDServicioContratado,
        IDCategoriaTicket: this.selectedCategory.IDCategoriaTicket,
        Observacion: this.cuerpo.trim(),
      }
      console.log('Data obj::::: ', obj)
      //return
      //this.usuarioHttp.enviarMail(this.model).subscribe(res => {
      this.usuarioHttp.registrarPostVenta(obj).subscribe(data => {
        console.log(data);
        if (data.StatusResul == 1) {
          this.flag = 1
          this.mensaje = data.Message
          //this.showViaService();
          this.openMensaje()
          this.clear();
        } else if (data.StatusResul == 2) {
          this.flag = 2
          this.mensaje = data.Message
          this.openMensaje()
        }
      },
        err => {
          console.log(err);
        }
      );
    } else {
      console.log('NO desea enviar solicitud')
    }
  }

  clear(){
    //this.nombres = '';
    //this.dni = '';
    //this.telefono = '';
    //this.email = '';
    this.selectedContrato = null;
    this.selectedCategory = null;
    this.cuerpo = '';
  }

  openMensaje() {
    this.addMensaje = true;
  }

  hideMensaje() {
    this.addMensaje = false;
  }

}
