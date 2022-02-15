/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */

import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TagMenuComponent } from './tag-menu/tag-menu.component';
import { Input } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';

@Component({
  selector: 'app-optionbar',
  templateUrl: './optionbar.component.html',
  styleUrls: ['./optionbar.component.scss'],
})
export class OptionbarComponent implements OnInit, OnChanges {
  @ViewChild('tagMenu',  { read: ElementRef }) tagMenu: ElementRef;

  @Output()zoomEvent = new EventEmitter<number>();
  @Input('field') searchField: any;
  @Input('viewType') viewType: string;
  @Input('isSelected') isSelected: boolean;
  public selected = false;
  public zoomSize = 0;
  public maxSize: any;
  public searchOption: boolean;
  public data: any[];

  constructor(
    public popoverController: PopoverController,
    private dataService: DataEventsService,
  ) {

   }

  ngOnInit() {
    this.getCheckedNum();
    this.getAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.searchField==='view'&&this.viewType!='selection'&&this.viewType!='columns') {
      this.searchOption = true;
    }else {
      this.searchOption = false;
    }
// 
    if(this.viewType == 'galery') {
      this.selected = false;
    }

    if(this.searchField == 'filter') {
      this.selected = this.isSelected
    }
  }

  getAll() {
    this.dataService.getAll().subscribe((data: any) => {
      this.data = [];
      this.changeData(data);
    })
  }

  changeData(nodes: any) {
    nodes.map((node: any) => {
      let n = node
      this.data = [...this.data, n];
      if(node.sub) {
        this.changeData(node.sub);
      }
    });
  }


  getCheckedNum() {
    if(this.searchField == 'view') {
      this.dataService.getCheckedNum().subscribe((num: any) => {
        if(this.data&&this.data.length == num&&num > 0) {
          this.selected = true;
        }else {
          this.selected = false;
        }
      });
    }else {
      this.dataService.getFilterSelectAllEvent().subscribe((data: any) => {
        this.selected = data;
      })
    }
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: TagMenuComponent,
      cssClass: 'tagmenu',
      event: ev,
      componentProps: { popover:this.popoverController },
      showBackdrop: false,
      translucent: true
    });
    popover.present();

    const { role } = await popover.onDidDismiss();
  }

  toggleSelect() {
    this.selected ? this.selected = false: this.selected = true;

    if(this.searchField == 'view') {
      this.data.map(n => {
        n.isChecked = this.selected;
      });
    }else {
      this.dataService.setFilterSelectAllEvent(this.selected);
    }
    this.dataService.fetchCheckedNode();
  }

  zoom(e: string) {
    e =='in' ? this.zoomSize++ : this.zoomSize--;

    if(this.zoomSize >= 4) {
      this.zoomSize = 4;
    }

    if(this.zoomSize <= -4) {
      this.zoomSize = -4;
    }

    if(this.zoomSize === 4) {
      this.maxSize='in';
    }else if(this.zoomSize === -4) {
      this.maxSize='out';
    }else {
      this.maxSize='';
    }
    this.zoomEvent.emit(this.zoomSize);
  }
}
