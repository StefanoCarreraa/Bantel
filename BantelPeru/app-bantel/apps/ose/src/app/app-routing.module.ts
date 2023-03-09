import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OseAuthenticatedGuard, OseRolesGuard } from '@ose/commons/guards';
import { UserRol } from '@ose/commons/models';

const routes: Routes = [
  { path: '', redirectTo: 'autenticacion', pathMatch: 'full' },

  {
    path: 'administrador',
  //  canActivate: [OseAuthenticatedGuard, OseRolesGuard],
  //  data: { roles: [ UserRol.admin, UserRol.intructor ] },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'autenticacion',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'externo',
    loadChildren: () => import('./features/externo/externo.module').then(m => m.ExternoModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
