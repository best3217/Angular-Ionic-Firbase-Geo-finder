import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OptionbarComponent } from './optionbar.component';
import { TagMenuComponent } from './tag-menu/tag-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HashtagsComponent } from './hashtags/hashtags.component';
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
      ],
  declarations: [OptionbarComponent, TagMenuComponent, HashtagsComponent],
  exports: [
    OptionbarComponent,
  ]
})
export class OptionbarModule {}
