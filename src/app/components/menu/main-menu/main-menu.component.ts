import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {

  constructor(private menuService: MenuService, private menu: MenuController) { }

  ngOnInit() {}

  openGeoFinder(){
    this.menuService.openSubmenu();
  }
}
