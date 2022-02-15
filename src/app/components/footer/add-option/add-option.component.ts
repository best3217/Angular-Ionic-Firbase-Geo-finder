import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { ModalController } from '@ionic/angular';
import { AddTagComponent } from '../add-tag/add-tag.component';
@Component({
  selector: 'app-add-option',
  templateUrl: './add-option.component.html',
  styleUrls: ['./add-option.component.scss'],
})
export class AddOptionComponent implements OnInit {
  @Input('nodes') nodes: any;
  @Input('viewType') viewType: any;

  ids: any[];
  collection: any = "nodes"
  
  constructor(
    public modalController: ModalController,
    public dataService: DataEventsService,
  ) { }

  ngOnInit() {
  }

  addNode(e: any) {
    if(e == 'tag') {
      this.tagModal();
    }else {
      this.ids = [];
      let newData = this.generateNewData(e);
      newData.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      newData.created_at = this.getCurrentDate()
      newData.sortType = 'item1';
      let activatedData = JSON.parse(localStorage.getItem('activeNode'));
      this.fetchIsChecked(this.nodes);

      if(this.ids.length > 0) {
        this.ids.map(id => {
          this.nodes.map((node: any) => {
            this.insertNodeIntoTree(node, id, JSON.parse(JSON.stringify(newData)));
          });
        });
      }else {
        if((this.viewType == 'galery'||this.viewType == 'columns')&&activatedData) {
          let id = activatedData.id;
          this.dataService.getDataByID(this.nodes, id).then((node: any) => {
            node.sub.push(newData);
            newData.pId = node.id;
            this.rename(newData.id, node.sub);
          });
        }else {
          this.nodes.push(newData);
          this.rename(newData.id, this.nodes);
        }
      }

      this.dataService.setAll(this.nodes);
      this.dataService.setChange(true);
      this.dataService.fetchCheckedNode();
    }
  }

  async tagModal() {
    const modal = await this.modalController.create({
      component: AddTagComponent,
      cssClass: 'add-tag-modal',
      componentProps: {
        'modalController': this.modalController,
      }
    });
    return await modal.present();
  }

  insertNodeIntoTree(node: any, id: any, newNode: any) {
    if (node.id == id) {
        node.isExpanded = true;
        if (newNode) {
            newNode.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            newNode.created_at = this.getCurrentDate()
            newNode.sortType = 'item2';
            newNode.pId = id;
            node.sub.push(newNode);
            this.rename(newNode.id, node.sub);
        }
    } else if (node.sub != null) {
        for (let i = 0; i < node.sub.length; i++) {
            this.insertNodeIntoTree(node.sub[i], id, newNode);
        }
    }
  }

  getCurrentDate(){
    let date = new Date();
    let yyyy = `${date.getFullYear()}`;
    let mm = (date.getMonth()+1).toString();
    let dd  = date.getDate().toString();
    let hh = date.getHours().toString();
    let m = date.getMinutes().toString();
    let ss = date.getSeconds().toString();
    return `${yyyy}-${mm[1]?mm:"0"+mm[0]}-${dd[1]?dd:"0"+dd[0]} ${hh[1]?hh:"0"+hh[0]}:${m[1]?m:"0"+m[0]}:${ss[1]?ss:"0"+ss[0]}`;
  }

  async rename(nId:any, nodes: any) {
    const modal = await this.modalController.create({
      component: RenameOptionComponent,
      cssClass: 'rename-option',
      componentProps: {
        'id': nId,
        'nodes': nodes,
        'flag': 'add',
        'currentModal': this.modalController,
      }
    });

    return await modal.present();
  }

  fetchIsChecked(nodes: any)
  {
    nodes.map((n: any) => {
      if(n.isChecked&&n.iconExpanded) {
        this.ids.push(n.id);
      }
      
      if(n.sub != null&&n.sub.length > 0) {
        this.fetchIsChecked(n.sub)
      }
    });
  }

  generateNewData(e: any) {
    switch (e) {
      case 'folder':
        return {
          id: '' as String,
          title: 'New folder' as String,
          iconExpanded: 'folder-open' as String,
          icon: 'folder' as String,
          pId: 0 as any,
          sub: [] as any,
          created_at: '' as any,
          sortType: '' as any,
        };

      case 'file':
        return {
          id: '' as String,
          title: 'New file' as String,
          icon: 'file' as String,
          pId: 0 as any,
          created_at: '' as any,
          sortType: '' as any,
        };
      default:
        break;
    }
  }
}
