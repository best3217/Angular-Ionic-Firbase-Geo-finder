import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import SwiperCore, { SwiperOptions } from 'swiper';
import { DataEventsService } from 'src/app/services/data-events.service';

@Component({
  selector: 'app-tile-view',
  templateUrl: './tile-view.component.html',
  styleUrls: ['./tile-view.component.scss'],
})
export class TileViewComponent implements OnInit, OnChanges {
  public config: SwiperOptions = {
    slidesPerView: 6,
    spaceBetween: 0,
  };

  public previewConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
  };

  public parentId: any;
  public activatedNode: any;
  public data: any;

  @Input('nodes') nodes:any;
  @ViewChild('swiper', { static: false }) swiper;

  constructor(
    private dataService: DataEventsService,
  ) { 
  
  }

  ngOnInit() {
  }

  detail(e:any) {
      this.swiper.swiperRef.slideTo(e)
  }

  ngOnChanges(): void {
    console.log(this.nodes);
    this.fetchIsChecked(this.nodes);
    this.data = this.nodes;
    this.nodes = this.nodes.filter((item: any) => item.pId == 0);  
    this.parentId = null;
    console.log(this.data);
  }

  fetchIsChecked(nodes) {
    nodes.map((n: any) => {
      n.isChecked = false;

      if(n.icon == 'folder') {
        n.isExpanded = false;
      }

      if(n.sub) {
        this.fetchIsChecked(n.sub);
      }
    })
  }

  openFolder(n:any) {
    if(n.iconExpanded) {
      if(this.activatedNode) {
        this.activatedNode.isChecked = false;
      }
      n.isChecked = true; 
      n.isExpanded = true; 
      this.parentId = n.pId;
      this.nodes = n.sub;
      this.activatedNode = n;
    }
  }

  backToParent(pId:any) {
    this.activatedNode.isChecked = false;
    this.activatedNode.isExpanded = false;

    if(pId == 0) {
      this.nodes = this.data;
      this.parentId = null;
    }else {
      this.dataService.getDataByPID(this.data, pId).then((data: any) => {
        if(data) {
          data.isChecked = true;
          this.activatedNode = data;
          this.nodes = data.sub;
          this.parentId = data.pId;
        }
      });
    }
}

}
