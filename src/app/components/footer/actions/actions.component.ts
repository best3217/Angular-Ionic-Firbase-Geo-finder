import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataEventsService } from 'src/app/services/data-events.service';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})

export class ActionsComponent implements OnInit {
  @Input('nodes') nodes: any;
  @Input('popover') popover: any;
  @Input('viewType') viewType: any;

  public checkedNum: number = 0;
  public isCopied: boolean;
  public actionFlag: string;
  public copiedObj: any[];
  public ids: any[];
  public arr: any[];
  
  constructor(
    public dataService: DataEventsService,
    public toastController: ToastController,
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    if(localStorage.getItem('isCopied')) {
      this.isCopied = true;
    }

    if(localStorage.getItem('copiedObj')) {
      this.copiedObj = JSON.parse(localStorage.getItem('copiedObj'));
    }

    if(localStorage.getItem('flag')) {
      this.actionFlag = localStorage.getItem('flag');
    }

    this.getCheckedNode();
  }

  getCheckedNode() {
    this.dataService.getCheckedNum().subscribe((data: any) => {
      this.checkedNum = data;
    });
  }

  close() {
    this.popover.dismiss();
  }

  handleCopy(e: any) {
    this.copiedObj = [];
    this.fetchIsChecked(this.nodes);

    this.isCopied = true;
    localStorage.setItem('flag', e);
    localStorage.setItem('isCopied', 'true');
    localStorage.setItem('copiedObj', JSON.stringify(this.copiedObj));

    this.close();

    setTimeout(() => {
      localStorage.removeItem('isCopied');
      localStorage.removeItem('copiedObj');
      localStorage.removeItem('flag');
      this.isCopied = false;
    }, 10000);
  }

  async copyWarningToast() {
    const alert = await this.alertController.create({
      cssClass: 'warning',
      message: 'The destination folder is subfolder of the source folder.',
      buttons: [
        {
          text: 'Skip',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  
  paste() {
    this.ids = [];
    this.fetchIsCheckedById(this.nodes);
    let activatedData = JSON.parse(localStorage.getItem('activeNode'));

    if(this.isCopied == true) {
      this.copiedObj.map((cObj: any) => {
        this.arr = [cObj.id];
        this.checkSubNode(cObj);

        if(this.ids.length > 0) {
          this.ids.map((id: any) => {
            if(this.arr.includes(id)) {
              this.copyWarningToast();
            }else {
              this.handlePaste(id, cObj, this.nodes);
            }
          });
        }else {
          if((this.viewType == 'galery'||this.viewType=='columns')&&activatedData) {
            let id = activatedData.id;  
            this.dataService.getDataByID(this.nodes, id).then((node: any) => {
              if(this.arr.includes(node.id)) {
                this.copyWarningToast();
              }else {
                this.handlePaste(node.id, cObj, this.nodes);
              }
            });
          }else {
            if(this.actionFlag == 'copy') {
              this.changeCopyObjId([cObj]);
            }
            cObj.pId = 0;
            let existNum = this.compareCopiedObjName(this.nodes, cObj.title, cObj).length;
            existNum > 0 ? cObj.title = cObj.title + ` - Copy`: cObj.title = cObj.title;
            this.nodes = [...this.nodes, cObj];
          }
        }
      });
    }

    this.dataService.setAll(this.nodes);
    localStorage.removeItem('isCopied');
    localStorage.removeItem('copiedObj');
    localStorage.removeItem('flag');
    this.dataService.setChange(true);
    this.isCopied = false;
    this.close();
  }

  handlePaste(id:string, cObj: any, nodes: any) {
    if(this.actionFlag == 'copy') {
      this.changeCopyObjId([cObj]);
    }

    nodes.map((n: any) => {
      if(n.id == id&&n.icon == 'folder') {
        if(this.actionFlag == 'cut') {
          this.handleRemove(cObj);
        }
        
        cObj.pId = n.id;
        n.isExpanded = true;
        let existNum = this.compareCopiedObjName(n.sub, cObj.title, cObj).length;
        existNum > 0 ? cObj.title = cObj.title + ` - Copy`: cObj.title = cObj.title;
        let num = this.compareName(n.sub, cObj.title, cObj).length;

        num > 0 ? cObj.title = cObj.title + `(${num})`: cObj.title = cObj.title;
        n.isChecked = false;
        n.sub.push(cObj);
      }else if(n.sub) {
        this.handlePaste(id, cObj, n.sub);
      }
    });
  }

  checkSubNode(cObj: any) {
    if(cObj.sub) {
      cObj.sub.map(n => {
        if(n.icon =='folder') {
          this.arr = [...this.arr, n.id];
        }
        this.checkSubNode(n);
      })
    }
  }
    
  handleRemove(n: any) {
      if(n.pId != 0) {
        this.dataService.getDataByPID(this.nodes, n.pId).then((pNode: any) => {
          const node = pNode.sub.find((item: any) => item.id == n.id);
          const index = pNode.sub.indexOf(node);
          pNode.sub.splice(index, 1);
        });
      }else {
          const node = this.nodes.find((item: any) => item.id == n.id);
          const index = this.nodes.indexOf(node);
          this.nodes.splice(index, 1);
      }
  }
  compareCopiedObjName(data: any, name: any, newData: any) {
    return data.map ( (item: any) => ({...item})).filter ( (item: any) => {
      if(item.title == name&&newData.icon === item.icon ) {
        return true;
      }
    });
  }

  compareName(data: any, name: any, newData: any) {
    return data.map ( (item: any) => ({...item})).filter ( (item: any) => {
      if(item.title.toLowerCase().indexOf(name.toLowerCase()) > -1&&newData.id !== item.id&&newData.icon === item.icon ) {
        return true;
      }
    });
  }

  changeCopyObjId(data) {
    data.map((d: any, i: any) => {
      d.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      if(d.sub) {
        this.changeCopyObjId(d.sub);
      }
    });
  }

  fetchIsCheckedById(nodes: any)
  {
    nodes.map((n: any) => {
      if(n.isChecked) {
          n.isChecked = false;
          this.ids.push(n.id);
      }

      if(n.sub) {
        this.fetchIsCheckedById(n.sub);
      }
    });
  }

  fetchIsChecked(nodes: any)
  {
    nodes.map((n: any) => {
      if(n.isChecked) {
          n.isChecked = false;
          this.copiedObj.push(JSON.parse(JSON.stringify(n)));
      }

      if(n.sub) {
        this.fetchIsChecked(n.sub);
      }
    });
  }
  
  cancel() {
    this.isCopied = false;
  }

}
