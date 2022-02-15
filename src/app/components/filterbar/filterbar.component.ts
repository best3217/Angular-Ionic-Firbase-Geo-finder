import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter, Input } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
@Component({
  selector: 'app-filterbar',
  templateUrl: './filterbar.component.html',
  styleUrls: ['./filterbar.component.scss'],
})
export class FilterbarComponent implements OnInit {

  searchTerm: string;
  collection: string = 'nodes';
  fab_buttons: any;
  filterData: any[];

  @Output()event = new EventEmitter<string>();
  @Output()searchEvent = new EventEmitter<string>();
  @Output()viewTypeEvent = new EventEmitter<string>();

  @Input('type') activeViewType: any;
  @Input('field') activeFilterBar: any;
  @Input('nodes') nodes: any;
  
  constructor(
    public dataService: DataEventsService,
  ) {
    this.activeViewType = 'galery';
    this.activeFilterBar = 'view';

    this.fab_buttons = [
      {
        icon:'list'
      },
      {
        icon:'selection'
      },
      {
        icon:'tree'
      },
      {
        icon:'galery'
      },
      {
        icon:'columns'
      },
      {
        icon:'tag'
      },
    ];
  }

  ngOnInit() {
    this.dataService.getFilteredData().subscribe((data: any) => {
      this.filterData = data;
    });
  }
  
  ngOnChanges() {
  }

  onSearch() {
    this.activeViewType = 'list';
    this.searchEvent.emit('list');

    this.event.emit('view');
    this.dataService.setSearchedData(this.searchTerm);
  }

  toggle(e: any) {
    this.activeFilterBar = e;
    this.event.emit(e);
  }

  changeViewType(type: any) {
    this.viewTypeEvent.emit(type);
    this.event.emit('view');
    this.fab_buttons.map((button: any) => {
      if(button.icon === type) {
        this.activeViewType = type;
      }
    });
  }

}
