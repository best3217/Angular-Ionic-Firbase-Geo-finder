import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { DataEventsService } from 'src/app/services/data-events.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public submenuOpen = false;
  private pages = [{title:'GeoFinder', icon:'/asstest/ionicons/search', click:'openGeoFinder'}];

  constructor(
    private menuService: MenuService, 
    private menu: MenuController, 
    public apiSvc: ApiService,
    public dataEventSvc: DataEventsService,
  ) {
    this.menuService.subscribeOpenSubmenu().subscribe({
      next: (v) => {
        this.submenuOpen = v;
      }
    });
   }

  ngOnInit() {
    this.apiSvc.getAll('nodes').subscribe((nodes: any) => {
      this.dataEventSvc.setAll(nodes);
    });

    this.apiSvc.getAll('tags').subscribe(data => {
      this.dataEventSvc.setTags(data);
    });
  }

  openGeoFinder(){
    this.menuService.openSubmenu();
  }
}
