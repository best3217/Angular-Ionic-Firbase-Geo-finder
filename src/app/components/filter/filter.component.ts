/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { filter, forEach } from '@angular-devkit/schematics';
import { Component, OnInit, OnChanges, Output, OnDestroy, EventEmitter, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataEventsService } from 'src/app/services/data-events.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnChanges {

  
  @ViewChild('fromDateElef', { read: ElementRef }) fromChild: ElementRef;
  @ViewChild('toDateElef', { read: ElementRef }) toChild: ElementRef;
  @ViewChild('DateTime') dateTime: any;
  
  @Output() filterEvent = new EventEmitter();
  @Output() AllSelectEvent = new EventEmitter()

  @Input('nodes') nodes: boolean;
  
  public fromDate: any;
  public toDate: any;
  
  public data: any[];
  
  public dateChecked: boolean;
  public dateSearchNum: any = 0;
  public isDate: boolean;
  public fDateData: any;
  
  public filterData: any;
  
  public isSortTypechecked = false;
  public isSort: boolean;
  public sortTypeNum: any = 0;
  public sortType: any[];
  public fSortData: any;

  public sensortypeData = [
    {
      title: 'item1',
      isChecked: false,
    },
    {
      title: 'item2',
      isChecked: false,
    },
    {
      title: 'item3',
      isChecked: false,
    }
  ];

  constructor(
    public dataService: DataEventsService,
    public toastController: ToastController
  ) {
  }

  ngOnInit() {
    if(localStorage.getItem('dateChecked')) {
      this.dateCheck();
      this.isDate = true;
    }

    if(localStorage.getItem('sortType')&&JSON.parse(localStorage.getItem('sortType')).length > 0) {
      this.sensortypeData.map((s: any) => {
        if(JSON.parse((localStorage.getItem('sortType'))).includes(s.title)) {
          s.isChecked = true;
        }
      });

      this.isSort = true;

      this.handleSortFilter();
    }

    this.checkSelectAllEvent();
  }

  checkSelectAllEvent() {
    this.dataService.getFilterSelectAllEvent().subscribe((boolean: any) => {
      if(boolean) {
        this.dateChecked = false;
        this.isSortTypechecked = false;
        this.isDate = true;
        this.isSort = true;
      }else {
        this.dateChecked = true;
        this.isSortTypechecked = true;
      }

      this.sensortypeData.map((s: any) => {
        s.isChecked = boolean;
      });

      this.dateCheck();
      this.sortCheckAll();
    })
  }

  ngOnChanges(): void {
    this.data = [];
    this.changeData(JSON.parse(JSON.stringify(this.nodes)));
  }

  ngOnDestroy(): void {
    if(!this.dateChecked) {
      localStorage.removeItem('fDate');
      localStorage.removeItem('tDate');
    }
  }

  changeData(nodes: any) {
    nodes.map((node: any) => {
      let n = node
      this.data = [...this.data, n];
      if(node.sub) {
        this.changeData(node.sub);
        delete n.sub;
      }
    });
  }

  addDate(e: any, toFrom: any){
    if(!e.detail.value){return;}
    switch (toFrom){
      case 'from':
        const fD = new Date(e.detail.value.split('T')[0]); //format YYYY-MM-DD 00:00
        this.fromDate = fD.toISOString();
        localStorage.setItem('fDate', this.fromDate);
        break;

      case 'to':
        const tD = new Date(e.detail.value.split('T')[0]);//format YYYY-MM-DD 00:00
        this.toDate = tD.toISOString();
        localStorage.setItem('tDate', this.toDate);
        break;
    }
    
    if(Date.parse(this.toDate) <= Date.parse(this.fromDate)) {
      this.dateTimeErrorToast();
      this.toChild.nativeElement.value = null;
      localStorage.removeItem('tDate');
      this.toDate = null;
    }else {
      this.handleFilterDate();
    }
    this.checkAllSelect();
  }

  handleFilterDate() {
    let data = this.data;
    this.fDateData =this.filterbyDate(data, Date.parse(this.fromDate), Date.parse(this.toDate));
    this.dateSearchNum = this.fDateData.length;

    if(this.isSortTypechecked) {
      this.filterData = this.filterBySort(this.fDateData, this.sortType);
    }else {
      this.filterData = this.fDateData;
    }

    this.dateChecked = true;
    localStorage.setItem('dateChecked', 'true');
    this.filterEvent.emit(this.filterData);
  }
  
  filterbyDate(nodes: any, from: any, to: any) {
    return nodes.map ( (item: any) => ({...item})).filter ( (item: any) => {
      let date = new Date(item.created_at);

      if(!to&&from <= Date.parse(date.toISOString())) {
        return true;
      }else if(to>=Date.parse(date.toISOString())&&!from) {
        return true;
      }
      else if(from<= Date.parse(date.toISOString())&&Date.parse(date.toISOString())<= to) {
        return true;
      }
    });
  }

  dateCheck() {
    this.dateChecked? this.dateChecked = false: this.dateChecked = true;

    this.dateChecked? localStorage.setItem('dateChecked', 'true') :  localStorage.removeItem('dateChecked');;

    if(this.dateChecked&&(this.fromDate = localStorage.getItem('fDate')||localStorage.getItem('tDate'))) {
      this.fromDate = localStorage.getItem('fDate');
      this.toDate = localStorage.getItem('tDate');
      this.handleFilterDate();
    }else {
      this.fromDate = '';
      this.toDate = '';

      this.fDateData = [];
      this.dateSearchNum = 0;
      this.filterData = this.fSortData;
      this.filterEvent.emit(this.filterData);
    }

    this.checkAllSelect();
  }

  cancelPicker(e) {
    switch (e){
      case 'from':
        this.fromChild.nativeElement.value = null;
        localStorage.removeItem('fDate');
        break;

      case 'to':
        this.toChild.nativeElement.value = null;
        localStorage.removeItem('tDate');
        break;
    }

    if(!this.fromDate && !this.toDate) {
      this.dateChecked = false;
      this.fDateData = [];
      this.filterData = this.fSortData;
      localStorage.removeItem('dateChecked');
    }else {
      this.handleFilterDate();
    }


    this.dateSearchNum = this.fDateData.length;
    this.filterEvent.emit(this.filterData);
    this.checkAllSelect();
  }

  remove(toFrom: any){
    switch (toFrom){
      case 'to':
        this.toChild.nativeElement.value = null;
        this.toDate.emit('');
        break;
      case 'from':
        this.fromChild.nativeElement.value = null;
        this.fromDate.emit('');
        break;
    }
  }

  collapse(e: any) {
    switch (e){
      case 'date':
        this.isDate? this.isDate = false: this.isDate = true;
        break;
      case 'sort':
        this.isSort? this.isSort = false: this.isSort = true;
        break;
    }
  }

  sortCheckAll() {
    this.isSortTypechecked ? this.isSortTypechecked = false: this.isSortTypechecked = true;
    this.sortType = [];

    this.sensortypeData.map (d => {
     d.isChecked = this.isSortTypechecked;
      if(this.isSortTypechecked) {
        this.sortType.push(d.title);
      }
    });

    this.handleSortFilter();
  }

  sortToggle(e: any) {
    e.isChecked? e.isChecked = false : e.isChecked = true;
    this.handleSortFilter();
    this.checkAllSelect();
  }

  handleSortFilter() {
    this.sortType = [];
    this.sensortypeData.map(d => {
      if(d.isChecked === false) {
      }else {
        this.sortType.push(d.title);
      }
    });

    if(this.sortType.length === 0) {
      this.isSortTypechecked = false;
    }else {
      this.isSortTypechecked = true;
    }

    localStorage.setItem('sortType', JSON.stringify(this.sortType))

    this.fSortData = this.filterBySort(this.data, this.sortType);
    this.sortTypeNum = this.fSortData.length;

    if((localStorage.getItem('fDate')||localStorage.getItem('tDate'))&&this.dateChecked&&this.sortType.length > 0) {
      this.filterData = this.filterbyDate(this.fSortData, Date.parse(this.fromDate), Date.parse(this.toDate));
    }else if(this.sortType.length == 0) {
      this.filterData = this.fDateData;
    }
    else {
      this.filterData = this.fSortData;
    }

    this.filterEvent.emit(this.filterData);
    this.checkAllSelect();
  }

  filterBySort(nodes, types: any) {
    return nodes.map ( (item: any) => ({...item})).filter ( (item: any) => {
      if (item.sub&&item.sub.length>=1 ) {
          item.sub = this.filterBySort( item.sub, types );
      }
      return types.includes(item.sortType);
    });
  }

  checkAllSelect() {
    let num = 0;
    this.sensortypeData.map((s: any) => {
      if(s.isChecked) {
        num++;
      }
    });

    if(this.dateChecked&&num == this.sensortypeData.length) {
      this.AllSelectEvent.emit(true);
    }else {
      this.AllSelectEvent.emit(false); 
    }
  }

  async dateTimeErrorToast() {
    const toast = await this.toastController.create({
      message: 'The End Date must be greater than Start Date',
      position: 'top',
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }
}
