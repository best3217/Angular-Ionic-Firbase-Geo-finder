/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable object-shorthand */
/* eslint-disable quote-props */
import { Component, OnInit, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataEventsService } from '../../../services/data-events.service';
import { ApiService } from 'src/app/services/api.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss'],
})
export class SubmenuComponent implements OnInit {
  @ViewChild('content') content: any;
  public nodes: any;
  public collection: string = "nodes"
  public changes: boolean;
  public viewType: any = 'galery';
  public searchField: any = 'view';
  public searchTerm: string;
  public filterData: any[];
  public zoomSize: any;
  public isSelected: boolean;

  constructor(
    public modalController: ModalController, 
    public apiSvc: ApiService,
    public dataEventSvc: DataEventsService) {
  }
  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.dataEventSvc.getAll().subscribe(data => {
      this.nodes = data;
      this.dataEventSvc.generatePath(this.nodes, '');
      console.log(this.nodes);
    });
  }

  getActiveParma(e: any) {
    this.searchField = e;
  }

  changeViewType(e: any) {
    this.viewType = e;
  }

  returnView(e: any) {
    this.searchField = 'view';
    if(e) {
      this.viewType = 'list';
    }else {

    }
  }

  zoom(e: any) {
    switch (e) {
      case -4:
        this.zoomSize = 'zoomOut4';
        break;
      case -3:
        this.zoomSize = 'zoomOut3';
        break;
      case -2:
        this.zoomSize = 'zoomOut2';
        break;
      case -1:
        this.zoomSize = 'zoomOut1';
        break;
      case 0:
        this.zoomSize = 'zoom';
        break;
      case 1:
        this.zoomSize = 'zoom1';
        break;
      case 2:
        this.zoomSize = 'zoom2';
        break;
      case 3:
        this.zoomSize = 'zoom3';
        break;
      case 4:
        this.zoomSize = 'zoom4';
        break;
      default:
        break;
    }
  }

  filterEvent(e: any) {
    this.filterData = e;
  }

  searchEvent(e: any) {
    this.viewType = 'list';
  }

  filterAllSelectEvent(e) {
    this.isSelected = e;
  }
}
