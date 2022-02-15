import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddOptionComponent } from './add-option/add-option.component';
import { ActionsComponent } from './actions/actions.component';
import { FooterComponent } from './footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddTagComponent } from './add-tag/add-tag.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { RemoveModalComponent } from './remove-modal/remove-modal.component'
import { RemoveWarningComponent } from './remove-warning/remove-warning.component'
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ColorPickerModule
      ],
  declarations: [FooterComponent, AddOptionComponent, ActionsComponent, AddTagComponent, RemoveModalComponent, RemoveWarningComponent],
  exports: [
    FooterComponent,
    ColorPickerModule,
  ]
})

export class FooterModule {}
