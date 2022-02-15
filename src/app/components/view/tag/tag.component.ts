import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataEventsService } from 'src/app/services/data-events.service';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { ModalController } from '@ionic/angular';
import { ColorOptionComponent } from '../../color-option/color-option.component';
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit {
  public tags: any;

  constructor(
    public apiSvc: ApiService,
    public dataEventSvc: DataEventsService,
    public modalController: ModalController,
  ) { }
  
  ngOnInit() {
    this.dataEventSvc.getTags().subscribe((tags: any) => {
      this.tags = tags;
    });
  }

  async rename(item: any, event, tag) {
    let css = 'rename-option';

    if(tag.title.toLowerCase() == 'status') {
      css = 'statusTag-option';
    }

    event.stopPropagation();
    const modal = await this.modalController.create({
      component: RenameOptionComponent,
      cssClass: css,
      componentProps: {
        'id': item.id,
        'nodes': tag.sub,
        'flag': 'rename',
        'tag': tag.title.toLowerCase(),
        'currentModal': this.modalController,
        'color': item.color,
      }
    });
    return await modal.present();
  }

  toggleCheck(e: any, event: any) {
    event.stopPropagation();
    e.isChecked ? e.isChecked = false : e.isChecked = true;
  }

  expandItem(e: any) {
    e.isExpanded ? e.isExpanded = false: e.isExpanded = true;
  }

  async changeColor(event: any, tag: any, tagItem: any) 
  {
    if(tag.title.toLowerCase() == 'status') {
      event.stopPropagation();
      const modal = await this.modalController.create({
        component: ColorOptionComponent,
        cssClass: 'color-option',
        componentProps: {
          'tag': tagItem,
          'currentModal': this.modalController,
        }
      });
      return await modal.present();
    }
  }
}
