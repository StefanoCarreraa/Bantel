import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OseLoadingComponent } from './loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
  declarations: [OseLoadingComponent],
  exports: [OseLoadingComponent],
  // entryComponents: [OseLoadingComponent], // solo para versiones anteriores a angular 9
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule
  ]
})
export class OseLoadingModule { }
