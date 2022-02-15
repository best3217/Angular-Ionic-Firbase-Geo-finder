import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { DataEventsService } from 'src/app/services/data-events.service';
@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent implements OnInit, OnChanges {

  @Input('nodes') nodes:any;
  initNodes!: any[];

  constructor(
    public platform: Platform, 
    public nav: NavController,
    public modalController: ModalController,
    public dataEventSvc: DataEventsService,
  ) {
  }
  ngOnInit() {
  }

  ngOnChanges() {
    // this.initNodes = this.nodes.filter((item: any) => item.pId == 0);
  }

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

  toggleCheck(e:any, event:any) {
    event.stopPropagation();
    e.isChecked ? e.isChecked = false : e.isChecked = true;

    this.dataEventSvc.fetchCheckedNode();
  }
}
