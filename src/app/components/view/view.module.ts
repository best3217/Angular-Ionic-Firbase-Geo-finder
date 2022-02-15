import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TreeNodeModule } from './tree-node/tree-node.module';
import { ViewComponent} from './view.component';
import { ListViewModule} from './list-view/list-view.module';
import { GalleryViewComponent} from './gallery-view/gallery-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnViewModule } from './column-view/column-view.module';
import { TitleViewModule } from './tile-view/title-view.module';
import { TagComponent } from './tag/tag.component';
@NgModule({
  declarations: [ViewComponent, GalleryViewComponent, TagComponent],
  imports: [
    IonicModule,
    CommonModule,
    TreeNodeModule,
    ListViewModule,
    FormsModule,
    ReactiveFormsModule,
    ColumnViewModule,
    TitleViewModule,
  ],
  exports:[
    ViewComponent,
  ]
})
export class ViewModule { }
