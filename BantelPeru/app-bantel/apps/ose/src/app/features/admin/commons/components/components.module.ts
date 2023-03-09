import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { UiModule } from '../ui/ui.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OseDefaultImgPipeModule } from '@ose/commons/pipe';
import { ChartsModule } from 'ng2-charts';
import { HomepageSliderComponent } from './homepage-slider/homepage-slider.component';
import { HomepagePlansComponent } from './homepage-plans/homepage-plans.component';
import { FormPerfilComponent } from './form-perfil/form-perfil.component';




const COMPONENTS = [
  MenuComponent,
  HomepageSliderComponent,
  HomepagePlansComponent,
  FormPerfilComponent
];

@NgModule({
  declarations: [ ...COMPONENTS, HomepagePlansComponent, HomepageSliderComponent, FormPerfilComponent],
  exports: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    UiModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    OseDefaultImgPipeModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
