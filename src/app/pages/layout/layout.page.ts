import { Component, OnInit, ViewChild } from '@angular/core';
import {MenuService} from '../../services/menu.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {

  constructor(private menuService: MenuService) {

  }

  ngOnInit() {
  }

  openGeoFinder(){
    this.menuService.openSubmenu();
  }
}
