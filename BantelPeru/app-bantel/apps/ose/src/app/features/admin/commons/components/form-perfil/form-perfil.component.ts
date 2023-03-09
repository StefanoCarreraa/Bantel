import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Perfil, PerfilUpdte } from '@ose/commons/models';

@Component({
  selector: 'app-form-perfil',
  templateUrl: './form-perfil.component.html',
  styleUrls: ['./form-perfil.component.scss']
})
export class FormPerfilComponent implements OnInit,OnChanges {
  //@Input()  usuario?: Perfil;
  //@Input()  plan?: Perfil;
  @Input() usuario: any;
  @Input() plan: any;

  //@Output() save: EventEmitter<PerfilUpdte> = new EventEmitter<PerfilUpdte>();
  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  uiform:FormGroup;

  constructor(private fb:FormBuilder) {
    this.uiform=this.fb.group({
      nombreCliente: [''],
      tipoDocumento: [''],
      nroDocumento: [''],

      idusuariobannet: [''],
      telefono:  ['', Validators.required],
      email:  ['', Validators.required],
      password:['']
    })

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.usuario?.currentValue) {
      this.updateFormValues(changes.usuario.currentValue);
    }
  }

  //updateFormValues(perfil: Perfil) {
  updateFormValues(perfil: any) {
    console.log('2222222222:Usuario:  ', this.usuario)
    this.uiform.patchValue({
      //idusuario: perfil.iD_PERSONA,
      //password: perfil.password,
      //telefono: perfil.telefono,
      //email: perfil.email,

      //idusuario: perfil.ID_PERSONA,
      //password: perfil.PASSWORD,
      telefono: perfil.TelefonoOrganizacion,
      email: perfil.EmailOrganizacion,
      nombreCliente: perfil.NombreOrganizacion,
      tipoDocumento: perfil.NombreDocumentoCorto,
      nroDocumento: perfil.NumDocOrganizacion,
    });
  }

  ngOnInit(): void {

  }


  send()
  {
    if (this.uiform.valid) {
      console.log('this.uiform:::: ', this.uiform.value)
      if (this.uiform.value.password === undefined) {
        this.uiform.controls.password.patchValue('');
      }
      let obj = {
        idUsuarioBannet: this.uiform.value.idusuariobannet,
        emailOrganizacion: this.uiform.value.email,
        telefonoOrganizacion: this.uiform.value.telefono,
        claveUsuario: this.uiform.value.password,
      }

      //this.save.emit(this.uiform.value);
      this.save.emit(obj);
    }

  }

}
