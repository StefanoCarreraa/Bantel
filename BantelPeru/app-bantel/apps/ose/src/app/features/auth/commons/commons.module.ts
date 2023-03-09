import { NgModule } from '@angular/core';
import { UiModule } from './ui/ui.module';
import { ComponentsModule } from './components/components.module';
import { HttpModule } from './http/http.module';
import { OseSessionModule } from '@ose/commons/services';
import {MessageModule} from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { RecuperarClaveComponent } from './modals/recuperar-clave/recuperar-clave.component';

@NgModule({
  exports: [
    UiModule,
    ComponentsModule,
    HttpModule,
    MessageModule,
    OseSessionModule,
    MessageModule,
    MessagesModule

  ],
  imports: [
    UiModule
  ],
  declarations: [RecuperarClaveComponent]
})
export class AuthCommonsModule { }
