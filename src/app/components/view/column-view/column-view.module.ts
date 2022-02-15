import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ColumnViewComponent } from './column-view.component';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [ColumnViewComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ],
  exports:[
    ColumnViewComponent
  ]
})
export class ColumnViewModule { }
