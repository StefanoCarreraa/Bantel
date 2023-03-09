import { HttpClient } from '@angular/common/http';
import { Optional, Inject, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecuperarClave } from '../../../interfaces/recuperar-clave';


@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.scss']
})
export class RecuperarClaveComponent implements OnInit {
  //@ViewChild('dialogRef2')
  //dialogRef2!: TemplateRef<any>;

  fromPage!: string;
  fromDialog!: string;
  email: string
  mensaje: string
  private api = 'https://192.168.136.34:5001/api/Login/EnvioCorreoCredenciales';
  mensaje1 = 'CORREO ENVIADO \n\nLe llegará un mail con su clave de acceso, le sugerimos que lo cambie \nen la opción Mi Perfil del Menú principal del Portal Bannet.'
  mensaje2 = 'CORREO NO REGISTRADO \n\nPor favor comuniquese con nuestra central 01 4800501 para que \nactualice sus datos o ingrese a Mi Perfil del Menú principal del Portal \nBannet.'
  mensaje3 = 'ERROR!!!'

  constructor(public dialogRef: MatDialogRef<RecuperarClaveComponent>,
    //@Optional() @Inject(MAT_DIALOG_DATA) public mydata: any) {
    //@Optional() @Inject(MAT_DIALOG_DATA) public mydata: RecuperarClave, public dialog: MatDialog, private http: HttpClient) {
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: RecuperarClave, private http: HttpClient) {
    console.log('111111:::', mydata )
  }

  ngOnInit(): void {
    this.fromDialog = "I am from dialog land...";
  }

  closeDialog() {
    this.email = this.mydata.correo
    //this.dialogRef.close({ event: 'close', data: this.fromDialog });
    this.dialogRef.close({ event: 'close', data: this.email });
  }

  enviar() {
    this.email = this.mydata.correo
    this.mensaje = ''
    if (this.email == '') {
      alert('Por favor, ingresar correo electrónico')
    } else {

     let obj = {
        correo: this.email
     }
      console.log('Objjjjj::: ', obj)

      this.validarCorreo(obj).subscribe(data => {
        console.log('dataaaaaa::: ', data)
        //return
        if (data.StatusResul == 1) {
          //this.openAviso()
          this.dialogRef.close({ event: 'close', data: this.email });
          this.mensaje = this.mensaje1
          console.log('MENSAJE1::: ' + this.mensaje)
          alert(this.mensaje)          
        } else if (data.StatusResul == 2) {
          this.mensaje = this.mensaje2
          console.log('MENSAJE2::: ' + this.mensaje)
          alert(this.mensaje)
          //this.openAviso()
        } else {
          this.mensaje = this.mensaje3
          console.log('MENSAJE3::: ' + this.mensaje)
          alert(this.mensaje)
          //this.openAviso()
        }
      });      
    }    
  }

  validarCorreo(obj: any): Observable<any> {
    return this.http.post(`${this.api}`, obj).pipe(map(
      data => data
    ));
  }

  cerrar() {
    this.dialogRef.close();
  }

  //openAviso() {
  //  const myTempDialog = this.dialog.open(this.dialogRef2, {
  //    width: '500px',
  //    height: '300px',
  //    //disableClose: true,
  //    //data: this.mensaje
  //  });
  //  myTempDialog.afterClosed().subscribe((res) => {
  //    //this.dialogRef.close({ event: 'close', data: this.email });
  //    console.log({ res });
  //  });
  //}
}
