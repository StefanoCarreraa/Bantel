import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl  } from '@angular/forms';
import { SignInCredentials } from '../../../interfaces/sign-in-credentials.interface';

import { MatDialog } from '@angular/material/dialog';
import { RecuperarClaveComponent } from '../../modals/recuperar-clave/recuperar-clave.component';
import { RecuperarClave } from '../../../interfaces/recuperar-clave';


@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  @Output() signIn: EventEmitter<SignInCredentials> = new EventEmitter<SignInCredentials>();
  signInForm: FormGroup;

  //@ViewChild('dialogRef')
  //dialogRef!: TemplateRef<any>;
  //myFooList = ['Some Item', 'Item Second', 'Other In Row', 'What to write', 'Blah To Do']
  item: RecuperarClave

  get usuarioError() {
    const usuario = this.signInForm.get('usuario') as FormControl;
    if (usuario.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (usuario.hasError('usuarioValidator')) {
      return usuario.errors.usuarioValidator;
    }

    return null;
  }

  constructor(private fb: FormBuilder, public dialog_: MatDialog) {

    this.signInForm = this.fb.group({
      usuario: ['', Validators.required ],
      password: ['', Validators.required]
      
    });
  }

  ngOnInit(): void {
    this.item = {
      correo: '',
    }
  }

  //openTempDialog() {
  //  const myTempDialog = this.dialog.open(this.dialogRef, { width: '600px', data: this.myFooList });
  //  myTempDialog.afterClosed().subscribe((res) => {

  //    // Data back from dialog
  //    console.log({ res });
  //  });
  //}

  //openCompDialog() {
  openEnviar() {
    this.item = {
      correo: '',
    }
    const myCompDialog = this.dialog_.open(RecuperarClaveComponent, {
      width: '500px',
      disableClose: true,
      data: this.item
      //data: this.myFooList
    });
    myCompDialog.afterClosed().subscribe((res) => {
      // Data back from dialog
      console.log({ res });
    });
  }


  sendData() {
    if (this.signInForm.valid) {
      this.signIn.emit(this.signInForm.value);
    }
  }

  // showViaService() {
  //   this.messageService.add({severity:'success', summary:'Bantel Perú', detail:'Se actualizaron los datos correctamente'});
  // }

}
