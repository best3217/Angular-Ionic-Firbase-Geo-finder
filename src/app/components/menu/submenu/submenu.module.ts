import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubmenuComponent } from './submenu.component';
import { TreeNodeModule } from '../../view/tree-node/tree-node.module';
import { FolderDataComponent } from '../../folder-data/folder-data.component';
import { MapComponent } from '../../map/map.component';
import { FilterComponent } from '../../filter/filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArrayToStringPipe } from '../../../pipes/array-to-string.pipe';
import { FooterModule } from '../../footer/footer.module';
import {SortComponent} from '../../../components/sort/sort.component';
import { FilterbarModule } from '../../../components/filterbar/filterbar.module';
import { OptionbarModule } from '../../../components/optionbar/optionbar.module';
import { ViewModule } from '../../../components/view/view.module';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { ColorOptionComponent } from '../../color-option/color-option.component';
import { GfinderModule } from 'gfinder'
@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    IonicModule,
    TreeNodeModule,
    ReactiveFormsModule,
    OptionbarModule,
    FilterbarModule,
    ViewModule,
    FooterModule,
    GfinderModule
  ],
  declarations: [SubmenuComponent, RenameOptionComponent, ColorOptionComponent, FolderDataComponent, MapComponent,ArrayToStringPipe, SortComponent, FilterComponent],
  exports: [
    SubmenuComponent
  ]
})

export class SubmenuModule {}
