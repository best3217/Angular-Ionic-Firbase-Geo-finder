import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
import { ModalController } from '@ionic/angular';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.scss'],
})
export class GalleryViewComponent implements OnInit, OnChanges {
  @Input('nodes') nodes:any;
  @Input('zoomSize') zoomSize:any;

  public parentId: any;
  public activatedNode: any;
  public data: any;

  constructor(
    public modalController: ModalController,
    private dataEventSvc: DataEventsService,
  ) { 
  }

  ngOnInit() {
    this.getNodes();
  }
  
  ngOnChanges(): void {
    if(!this.zoomSize) {
      this.getNodes();
    }
  }
  
  getNodes() {
    this.fetchIsChecked(this.nodes);
    this.data = this.nodes;
    this.parentId = null;
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
    this.nodes.map((node: any) => {
      node.isChecked = false;
    });

    if(n.iconExpanded) {
      n.isExpanded = true; 
      this.parentId = n.pId;
      this.nodes = n.sub;
      this.activatedNode = n;
    }
    localStorage.setItem('activeNode', JSON.stringify(this.activatedNode));
  }

  toggleCheck(e:any, event:any) {
    event.stopPropagation();
    e.isChecked ? e.isChecked = false : e.isChecked = true;

    this.dataEventSvc.fetchCheckedNode();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('activeNode');
  }

  backToParent(pId:any) {
    this.activatedNode.isExpanded = false;

    this.nodes.map((node: any) => {
      node.isChecked = false;
    });

    if(pId == 0) {
      this.nodes = this.data;
      this.parentId = null;
      localStorage.removeItem('activeNode');
    }else {
      this.dataEventSvc.getDataByPID(this.data, pId).then((data: any) => {
        if(data) {
          this.activatedNode = data;
          this.nodes = data.sub;
          this.parentId = data.pId;
        }
        localStorage.setItem('activeNode', JSON.stringify(data));
      });
    }
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
}
