import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
import { HashtagsComponent } from '../hashtags/hashtags.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-tag-menu',
  templateUrl: './tag-menu.component.html',
  styleUrls: ['./tag-menu.component.scss'],
})
export class TagMenuComponent implements OnInit, OnChanges {
  @Input('popover') popover: any;
  public isActive: any;
  public tags: any[];
  constructor(
    public dataService: DataEventsService,
    public modalController: ModalController,
  ) {
  }

  ngOnInit() {
    this.dataService.getTags().subscribe((tags: any) => {
      this.tags = tags;
      console.log(tags);
    });
  }

  ngOnChanges(): void {
  }

  expandItem(e: any, ev: any) {
    e.isExpanded ? e.isExpanded = false: e.isExpanded = true;
    if(e.title.toLowerCase() === 'hashtags') {
      this.popover.dismiss();
      this.hastagsPopover(ev);
    }
  }

  async hastagsPopover(event: any) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: HashtagsComponent,
      cssClass: 'hashtags',
      componentProps: {menu: this.tags, currentModal: this.modalController}
    });

    return await modal.present();
  }
}
