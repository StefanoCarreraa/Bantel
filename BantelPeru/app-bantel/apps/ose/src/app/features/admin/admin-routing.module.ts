import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DashboardView } from './views/dashboard/dashboard.view';
import { PendingDocumentsComponent } from './views/pending-documents/pending-documents.component';
import { MyPageComponent } from './views/my-page/my-page.component';
import { Opcion1Component } from './views/opcion1/opcion1.component';
import { MedirvelocidadComponent } from './views/medirvelocidad/medirvelocidad.component';
import { PostventaComponent } from './views/postventa/postventa.component';
import { ComprobantesDocumentsComponent } from './views/comprobantes-documents/comprobantes-documents.component';
import { LibroReclamacionesComponent } from './views/libro-reclamaciones/libro-reclamaciones.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'home', component: DashboardView },
      { path: 'documents', component: PendingDocumentsComponent },
      { path: 'mypage', component: MyPageComponent },
      { path: 'medirvelocidad', component: MedirvelocidadComponent },
      { path: 'postventa', component: PostventaComponent },
      { path: 'comprobantes', component: ComprobantesDocumentsComponent },
      { path: 'reclamaciones', component: LibroReclamacionesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
