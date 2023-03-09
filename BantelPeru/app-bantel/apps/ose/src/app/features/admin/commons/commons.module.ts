import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';
import { ComponentsModule } from './components/components.module';
import { HttpModule } from './http/http.module';
import { OseErrorsInterceptorModule, OseTokenInterceptorModule } from '@ose/commons/interceptors';
import { OseSessionModule } from '@ose/commons/services';
import { OseMaestroHttpModule } from '@ose/commons/http';
import { OseUsuarioHttpodule } from '../../../../../../../libs/ose-commons/src/lib/http/usuario/usuario.module';

@NgModule({
  exports: [
    UiModule,
    ComponentsModule,
    HttpModule,
    OseErrorsInterceptorModule,
    OseSessionModule,
    OseTokenInterceptorModule,
    OseMaestroHttpModule,
    OseUsuarioHttpodule

  ],
})
export class AdminCommonsModule { }
