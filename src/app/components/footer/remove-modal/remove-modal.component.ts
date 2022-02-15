import { Component, OnInit, Input } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
import { ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-remove-modal',
  templateUrl: './remove-modal.component.html',
  styleUrls: ['./remove-modal.component.scss'],
})
export class RemoveModalComponent implements OnInit {
  @Input() ids: any;
  @Input() data: any;
  @Input() currentModal: any;
  @Input() flag: any
  @Input() checkedObj: any
  constructor(
    public navParams: NavParams,
    public dataService: DataEventsService,
    public toastController: ToastController,
  ) {
    this.ids = navParams.get('ids');
    this.currentModal = navParams.get('currentModal');
    this.data = navParams.get('data');
    this.flag = navParams.get('flag');
    this.checkedObj = navParams.get('checkedObj');
   }

  ngOnInit() {}

  dismiss() {
    this.currentModal.dismiss({
      'dismissed': true
    });
  }

  remove() {
    this.checkedObj.map((n: any) => {
      if(n.pId != 0) {
        this.dataService.getDataByPID(this.data, n.pId).then((pNode: any) => {
          if(pNode) {
            const node = pNode.sub.find((item: any) => item.id == n.id);
            let index = pNode.sub.indexOf(node)
            pNode.sub.splice(index, 1);
          }
        });
      }else {
        this.data = this.data.filter((item: any) => item.id != n.id);
      }
    });

    if(this.flag == 'tag') {
      this.dataService.setTags(this.data);
    }else {
      this.dataService.setChange(true);
      this.dataService.setAll(this.data);
      this.deleteSucccessToast();
    }
    this.dataService.fetchCheckedNode();
    this.dismiss();
  }

  async deleteSucccessToast() {
    const toast = await this.toastController.create({
      message: 'Selected file(s), folder(s) deleted.',
      position: 'top',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }
}
