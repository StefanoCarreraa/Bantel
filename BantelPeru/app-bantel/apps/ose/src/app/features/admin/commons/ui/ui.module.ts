import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {SidebarModule} from 'primeng/sidebar';
import {MenubarModule} from 'primeng/menubar';
import {TabMenuModule} from 'primeng/tabmenu';
import {GalleriaModule} from 'primeng/galleria';
import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ProgressBarModule} from 'primeng/progressbar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {PasswordModule} from 'primeng/password';
import {AvatarModule} from 'primeng/avatar';


import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  exports: [
    MatDialogModule,
    SidebarModule,
    MenubarModule,
    TabMenuModule,
    GalleriaModule,
    CarouselModule,
    ButtonModule,
    TableModule,
    ProgressBarModule,
    SliderModule,
    MultiSelectModule,
    DropdownModule,
    FieldsetModule,
    PasswordModule,
    AvatarModule,
    TooltipModule,
    MessagesModule,
    MessageModule,
    InputTextModule,
    RippleModule,
    DialogModule
  ]
})
export class UiModule { }
