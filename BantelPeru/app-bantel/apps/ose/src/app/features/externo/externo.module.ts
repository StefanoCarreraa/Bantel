import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternoRoutingModule } from './externo-routing.module';
import { ExternoComponent } from './externo.component';
import { SolicitudPlanComponent } from './views/solicitud-plan/solicitud-plan.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MatIconModule } from '@angular/material/icon';
import { AdminCommonsModule } from '../admin/commons/commons.module';

@NgModule({
  declarations: [ExternoComponent, SolicitudPlanComponent],
  imports: [
    CommonModule,
    ExternoRoutingModule,
    AdminCommonsModule,
    CheckboxModule,
    FormsModule,
    InputTextareaModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class ExternoModule { }
