import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCommonsModule } from './commons/commons.module';
import { DashboardView } from './views/dashboard/dashboard.view';
import { PendingDocumentsComponent } from './views/pending-documents/pending-documents.component';
import { MyPageComponent } from './views/my-page/my-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Opcion1Component } from './views/opcion1/opcion1.component';
import { MedirvelocidadComponent } from './views/medirvelocidad/medirvelocidad.component';
import { PostventaComponent } from './views/postventa/postventa.component';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { OseUsuarioHttpodule } from '@ose/commons/http/usuario/usuario.module';
import { MatIconModule } from '@angular/material/icon';
import { ComprobantesDocumentsComponent } from './views/comprobantes-documents/comprobantes-documents.component';
import { LibroReclamacionesComponent } from './views/libro-reclamaciones/libro-reclamaciones.component';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardView,
    PendingDocumentsComponent,
    MyPageComponent,
    Opcion1Component,
    MedirvelocidadComponent,
    PostventaComponent,
    ComprobantesDocumentsComponent,
    LibroReclamacionesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminCommonsModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class AdminModule { }
