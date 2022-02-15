/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @angular-eslint/no-input-rename */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddOptionComponent } from './add-option/add-option.component';
import { PopoverController } from '@ionic/angular';
import { DataEventsService } from 'src/app/services/data-events.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ActionsComponent } from './actions/actions.component';
import { ApiService } from 'src/app/services/api.service';
import { ModalController } from '@ionic/angular';
import { RemoveModalComponent } from './remove-modal/remove-modal.component';
import { RemoveWarningComponent } from './remove-warning/remove-warning.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input('nodes') nodes: any;
  @Input('type') activeFilterBar: any;
  @Input('changes') changes: boolean;
  @Input('viewType') viewType: any;
  @Input('filterData') filterData: any;
  
  @Output()returnview = new EventEmitter<string>();

  ids!: any;
  collection: any = 'nodes'
  isChange: boolean;
  isShow: boolean;
  tags: any;
  checkedObj: any[];

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController,
    public dataService: DataEventsService,
    public alertController: AlertController,
    public toastController: ToastController,
    public apiSvc: ApiService
  ) {}

  ngOnInit() {
    this.getTags();
    this.checkChanges();
    this.checkFilterData();
  }

  getTags() {
    this.dataService.getTags().subscribe((tags: any) => {
      this.tags = tags;
    })
  }

  ngOnChanges(): void {
    this.filterData&&this.filterData.length > 0 ? this.isShow = true : this.isShow = false;
    
    if(!this.filterData) {
      this.filterData = []
    }
    this.dataService.setFilteredData(this.filterData);
  }

  checkFilterData() {
    // this.dataService.getFilteredData().subscribe((data: any) => {
    //   this.filteredData = data;
    //   data.length > 0 ? this.isShow = true : this.isShow = false;
    // })
  }

  checkChanges() {
    this.dataService.getChange().subscribe((data: any) => {
      this.isChange = data;
    })
  }

  async actionPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ActionsComponent,
      cssClass: 'footermenu',
      componentProps: { nodes:this.nodes, viewType: this.viewType, onClick: () => {popover.dismiss(); }},
      event: ev,
      showBackdrop: false,
      translucent: true
    });

    popover.present();
    await popover.onDidDismiss();
  }

  async addPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: AddOptionComponent,
      cssClass: 'footermenu',
      componentProps: { nodes: this.nodes, popover: this.popoverController, viewType: this.viewType },
      event: ev,
      showBackdrop: false,
      translucent: true
    });
    popover.present();

    setTimeout(() => {
      this.close();
    }, 1500);
  }

  
  close() {
    this.popoverController.dismiss();
  }

  async remove() {
    this.ids = [];
    this.checkedObj = [];
    if(this.viewType == 'tag') { 
      this.fetchIsChecked(this.tags);
    }else {
      this.fetchIsChecked(this.nodes);
    }

    if(this.ids.length == 0) {
      this.removeWarning();
    }else {
      if(this.viewType == 'tag') {
        this.removeTag();
        console.log(this.tags);
      }else {
        this.removeNode();
      }
    }
  }
  
  async removeWarning() {
    const modal = await this.modalController.create({
      component: RemoveWarningComponent,
      cssClass: 'remove-warning-modal',
      componentProps: {
        'currentModal': this.modalController,
      }
    });
    return await modal.present();
  }

  async removeNode() {
    const modal = await this.modalController.create({
      component: RemoveModalComponent,
      cssClass: 'remove-modal',
      componentProps: {
        'ids': this.ids,
        'data': this.nodes,
        'checkedObj': this.checkedObj,
        'flag': 'node',
        'currentModal': this.modalController,
      }
    });
    return await modal.present();
  }

  async removeTag() {
    const modal = await this.modalController.create({
      component: RemoveModalComponent,
      cssClass: 'remove-modal',
      componentProps: {
        'ids': this.ids,
        'checkedObj': this.checkedObj,
        'data': this.tags,
        'flag': 'tag',
        'currentModal': this.modalController,
      }
    });
    return await modal.present();
  }

  handleRemove(nodes: any, id: any) {
    return nodes.map ( (n: any) => ({...n})).filter ( (n: any) => {
      if (n.sub) {
        n.sub = this.handleRemove( n.sub, id );
      }
      return n.id !== id;
    });
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

  return() {
    this.ids = [];
    this.returnview.emit();
  }

  fetchIsChecked(nodes: any)
  {
    nodes.map((n: any) => {
      if(n.isChecked) {
        this.ids.push(n.id);
        this.checkedObj.push(n);
      }
      if(n.sub) {
        this.fetchIsChecked(n.sub);
      }
    });
  }

  displayData() {
    this.dataService.setFilteredData(this.filterData);
    this.returnview.emit('list');
  }

  save() {
    if(this.viewType == 'tag') {
      this.apiSvc.deleteAll('tags').then(data => {
        this.tags.map((t: any) =>  {
          let tag = JSON.parse(JSON.stringify(t));
          delete tag.isChecked;
          delete tag.isExpanded;

          this.retrieveData(tag);
          this.apiSvc.insert('tags', tag);
        });
      });
    }else {
      this.isChange = false;
      this.apiSvc.deleteAll(this.collection).then(data => {
        if(this.nodes) {
          this.nodes.map ( (n: any) => {
            let node = JSON.parse(JSON.stringify(n));
  
            delete node.isChecked;
            delete node.isExpanded;
            this.retrieveData(node);
            this.apiSvc.insert(this.collection, node);
          });
        }
      });
    }
    this.dataService.setChange(false);
  }

  retrieveData(data: any) {
    if(data.sub) {
      data.sub.map((sub: any) => {
        delete sub.isChecked;
        delete sub.isExpanded;
        this.retrieveData(sub);
      })
    }
  }

  reset() {
    this.dataService.setFilterSelectAllEvent(false);
  }
}
