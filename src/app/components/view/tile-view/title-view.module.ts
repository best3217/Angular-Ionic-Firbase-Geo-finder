import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { TileViewComponent } from './tile-view.component';

@NgModule({
  declarations: [TileViewComponent],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule
  ],
  exports:[
    TileViewComponent
  ]
})
export class TitleViewModule { }
