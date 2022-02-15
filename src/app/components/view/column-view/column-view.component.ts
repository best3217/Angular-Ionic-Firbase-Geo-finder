import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { ModalController } from '@ionic/angular';
import { DataEventsService } from 'src/app/services/data-events.service';
import { preventDefault } from 'ol/events/Event';
import { IonicSwiper } from '@ionic/angular';
import { SwiperComponent } from "swiper/angular";
import  SwiperCore, { SwiperOptions } from 'swiper';
import Swiper from 'swiper/bundle';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-column-view',
  templateUrl: './column-view.component.html',
  styleUrls: ['./column-view.component.scss'],
})
export class ColumnViewComponent implements OnInit, OnChanges {

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
  };
  @ViewChild('swiper') swiper?: SwiperComponent;
  @Input('nodes') nodes:any;
  activatedNode: any;
  parentId: any;
  swiperData: any[];
  activeIndex: number = 0;

  constructor(
    public modalController: ModalController,
    public dataEventSvc: DataEventsService
  ) {}

  async rename(n: any, event: any) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: RenameOptionComponent,
      cssClass: 'rename-option',
      componentProps: {
        'id': n.id,
        'nodes': this.nodes,
        'flag': 'rename',
        'currentModal': this.modalController,
      }
    });
    return await modal.present();
  }

  ngOnChanges(): void {
    this.swiperData = [this.nodes];
    this.nodes = this.nodes.filter((item: any) => item.pId == 0);  
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    localStorage.removeItem('activeNode');
  }

  onSlideChange() {
    let sRef= this.swiper.swiperRef;
    this.activeIndex = sRef.activeIndex;
    if (sRef.activeIndex < sRef.previousIndex) {

      let pId = this.swiperData[this.activeIndex][0].pId;
      console.log(pId);
      if(pId == 0) {
        localStorage.removeItem('activeNode');
      }else {
        this.dataEventSvc.getDataByPID(this.nodes, pId).then((node: any) => {
          localStorage.setItem('activeNode', JSON.stringify(node));
        });
      }

      this.checkedClear(this.swiperData[this.activeIndex+1]);
      let num = this.swiperData.length-sRef.activeIndex-1;
      this.swiperData.splice(sRef.activeIndex + 1, num);
    }
    
    new Swiper('swiper', this.config);
  }

  onSwiper(swiper: any) {
    console.log(swiper)
    swiper.update();
  }

  openFolder(n: any) {
    if(n.iconExpanded) {
      this.activatedNode = n;
      if(n.pId == 0) {
        this.checkedClear(this.nodes);
      }else {
        this.dataEventSvc.getDataByPID(this.nodes, n.pId).then((node: any) => {
          if(node) {
            this.checkedClear(node.sub);
          }
        })
      }
      
      localStorage.setItem('activeNode', JSON.stringify(this.activatedNode));

      this.swiperData.push(n.sub);
      Promise.all([this.swiperData]).then(() => {
        setTimeout(() => {
          this.swiper.swiperRef.slideNext();
        }, 150);
      });
    }
  }
  
  checkedClear(nodes: any) {
    nodes.map((n: any) => {
      n.isChecked = false;
      n.isExpanded = false;
    })
  }

  slideTo(index: any) {
    this.swiper.swiperRef.slideTo(index);
  }

  toggleCheck(n:any, event:any) {
    event.stopPropagation();
    n.isChecked = !n.isChecked;

    this.dataEventSvc.fetchCheckedNode();
  }
}
