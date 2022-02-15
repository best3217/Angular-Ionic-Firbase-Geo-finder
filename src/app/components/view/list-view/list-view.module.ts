import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListViewComponent } from './list-view.component';
 

@NgModule({
  declarations: [ListViewComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    ListViewComponent,
  ]
})
export class ListViewModule { }
