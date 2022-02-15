import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
  @Output() sortFilter = new EventEmitter();
  @Input('nodes') nodes: any;

  value:string = '';
  constructor(
    private dataService:DataEventsService
  ) { }

  ngOnInit() {
    this.value = localStorage.getItem('sort');
    console.log(this.nodes);
  }

  compareASC( a, b ) {
    if ( a.title.toLowerCase() < b.title.toLowerCase() ){
      return -1;
    }
    
    if ( a.title.toLowerCase() > b.title.toLowerCase() ){
      return 1;
    }

    return 0;
  }

  compareDESC( a, b ) {
    if ( a.title.toLowerCase() > b.title.toLowerCase()){
      return -1;
    }
    if ( a.title.toLowerCase() < b.title.toLowerCase() ){
      return 1;
    }
    return 0;
  }

  compareData(nodes, sort) {
    if(this.value === 'asc') {
      nodes.sort(this.compareASC);
    }else {
      nodes.sort(this.compareDESC);
    }

    nodes.map((n: any) => {
      if(n.sub) {
      
        this.compareData(n.sub, sort);
      }
    });
  }

  selectFilter(e:any){
    this.value = e.detail.value;
    this.sortFilter.emit(this.value);

    this.compareData(this.nodes, this.value);
   
    localStorage.setItem('sort', this.value)
  }

}
