import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LayoutPageRoutingModule } from './layout-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutPage } from './layout.page';
// import { MenuComponent } from '../../components/menu/menu.component';
import { MenuComponentModule } from '../../components/menu/menu.module';
// import { SubmenuModule } from '../../components/menu/submenu/submenu.module';
import { FilterbarModule } from '../../components/filterbar/filterbar.module';
import { OptionbarModule } from '../../components/optionbar/optionbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    // SubmenuModule,
    ReactiveFormsModule,
    FilterbarModule,
    OptionbarModule,
    MenuComponentModule
  ],
  declarations: [LayoutPage],
})
export class LayoutPageModule {}
