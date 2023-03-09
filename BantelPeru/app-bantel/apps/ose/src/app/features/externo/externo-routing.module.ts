import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternoComponent } from './externo.component';
import { SolicitudPlanComponent } from './views/solicitud-plan/solicitud-plan.component';


const routes: Routes = [
  { path: '', redirectTo: 'solicitudplan' },
  {
    path: '',
    component: ExternoComponent,
    children: [
      { path: 'solicitudplan', component: SolicitudPlanComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternoRoutingModule { }
