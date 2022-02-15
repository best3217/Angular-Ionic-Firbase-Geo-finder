import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmenuModule } from '../../components/menu/submenu/submenu.module';
import { IonicModule } from '@ionic/angular';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent, MainMenuComponent],
  imports: [
    CommonModule,
    SubmenuModule,
    IonicModule
  ],
  exports: [MenuComponent,MainMenuComponent]
})
export class MenuComponentModule { }
