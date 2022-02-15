import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RenameOptionComponent } from '../../rename-option/rename-option.component';
import { DataEventsService } from 'src/app/services/data-events.service';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnChanges {
  @Output()listDestroyEvent = new EventEmitter<string>();
  public nodes: any;
  public data: any;
  public filterData: any[];

  constructor(
    public modalController: ModalController,
    private dataEventSvc: DataEventsService,
  ) {
  }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.dataEventSvc.getAll().subscribe((data: any) => {
      this.nodes = data;

      this.data = [];
      this.changeData(this.nodes);
      this.checkSearchData();
      this.checkFilteredData();
    })
  }

  ngOnChanges() {
  
  }

  changeData(nodes: any) {
    nodes.map((node: any) => {
      const n = node
      this.data = [...this.data, n];
      if(node.sub) {
        this.changeData(node.sub);
      }
    });
  }

  checkFilteredData() {
    this.dataEventSvc.getFilteredData().subscribe((data: any) => {
      this.filterData = data;
      if(data.length > 0) {
        let newData = [];
        data.map((fd: any) => {
          this.data.map((d: any) => {
            if(fd.id == d.id) {
              newData = [...newData, d ];
            }
          })
        });
        this.data = newData;
      }

    });
  }

  checkSearchData() {
    this.dataEventSvc.getSearchData().subscribe((searchTerm: any) => {
      
      this.data = [];
      this.changeData(this.nodes);

      if(this.filterData&&this.filterData.length > 0) {
        let newData = [];
        this.filterData.map((fd: any) => {
          this.data.map((d: any) => {
            if(fd.id == d.id) {
              newData = [...newData, d ];
            }
          })
        });
        this.data = newData;
      }

      this.data = this.data.filter((item: any) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
    })
  }

  ngOnDestroy(): void {
    this.listDestroyEvent.emit();
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

  toggleCheck(e:any) {
    if(e.sub&&e.sub.length >= 1) {
      this.toggleCheckNestedData(e.sub, e.isChecked)
    }
    
    e.isChecked ? e.isChecked = false : e.isChecked = true;
    this.dataEventSvc.fetchCheckedNode();
  }

  toggleCheckNestedData(data:any, isChecked:any) {
    data.map((d:any) => {
      isChecked ? d.isChecked = false: d.isChecked = true;

      if(d.sub&&d.sub.length >= 1) {
        this.toggleCheckNestedData(d.sub, isChecked);
      }
    })
  }
}
