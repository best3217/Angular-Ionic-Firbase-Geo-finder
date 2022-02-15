import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './tree-node.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [TreeNodeComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    TreeNodeComponent
  ]
})
export class TreeNodeModule { }
