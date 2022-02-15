import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnChanges {
  
  @Input('nodes') nodes: any;
  @Input('type') type: any;
  @Input('zoomSize') zoomSize: any;
  @Output()searchDestroy = new EventEmitter<string>();
  
  constructor(
    public dataService: DataEventsService,
  ) { 
  }
  
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  listEvent() {
    // this.dataService.getAll().subscribe((nodes: any) => {
    //   this.nodes = nodes;
    // });
    // this.searchDestroy.emit();
  }

}
