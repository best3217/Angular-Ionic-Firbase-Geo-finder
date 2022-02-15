import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FilterbarComponent } from './filterbar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
      ],
  declarations: [FilterbarComponent],
  exports: [
    FilterbarComponent
  ]
})
export class FilterbarModule {}
