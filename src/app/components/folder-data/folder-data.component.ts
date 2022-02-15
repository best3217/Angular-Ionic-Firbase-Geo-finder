/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataEventsService } from '../../services/data-events.service';
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import { ApiService } from '../../services/api.service';

interface DataPoint{
  name: Array<string>;
  monitorPointType: Array<string>;
  monitorPointGroup: Array<string>;
  alarmLevel: Array<number>;
}

@Component({
  selector: 'app-folder-data',
  templateUrl: './folder-data.component.html',
  styleUrls: ['./folder-data.component.scss'],
})
export class FolderDataComponent implements OnInit {

  @Input() data: any;
  @Input() index: number;

  @ViewChild('name', { read: ElementRef }) name: ElementRef;
  @ViewChild('monitorPointType', { read: ElementRef }) monitorPointType: ElementRef;
  @ViewChild('monitorPointGroup', { read: ElementRef }) monitorPointGroup: ElementRef;
  @ViewChild('alarmLevel', { read: ElementRef }) alarmLevel: ElementRef;
  @ViewChild('locationNorth', { read: ElementRef }) locationNorth: ElementRef;
  @ViewChild('locationEast', { read: ElementRef }) locationEast: ElementRef;
  @ViewChild('locationElevation', { read: ElementRef }) locationElevation: ElementRef;

  public newData: DataPoint = this.cleanData();
  private restoreData = [];
  private oldData;

  constructor(private apiService: ApiService ,private modalController: ModalController, private dataService: DataEventsService) {
    this.oldData = this.data;
  }

  ngOnInit() {

  }
  save(){
    this.addData();
    this.restoreData.push(this.data);
    this.data = {...this.data, ...this.newData};
    this.newData = this.cleanData();

    if(!this.checkForChanges()){
      this.restoreData.pop();
      return;
    }

    this.postData();
  }

  checkForChanges(){
    if(Object.entries(this.restoreData[this.restoreData.length - 1]).toString() === Object.entries(this.data).toString()){
      return false;
    }else{
      return true;

    }
  }

  postData(){
    const data = diff(this.restoreData[this.restoreData.length -1], this.data);
    const pushData = new Object();

    Object.entries(data).map(d =>{
      // TODO: make dynamic
      if ( (d[0] === 'monitorPointType')  ){
        pushData[d[0]] = {set:this.data.monitorPointType};
        return;
      }
      if( (d[0] === 'monitorPointGroup')){
        pushData[d[0]] = {set:this.data.monitorPointGroup};
        return;
      }
      pushData[d[0]] = {set:d[1][0]};

    });
    // console.log('diff');
    // console.log(diff(this.restoreData[0], this.data));
    // eslint-disable-next-line @typescript-eslint/dot-notation
    pushData['id'] = this.data.id;
    //solr version cant be touched so remove it from the push
    delete pushData['_version_'];

    // this.apiService.postData(pushData);
  }

  // get data from all ViewChildren and add it to newData
  addData(){
    this.newData.name.push(this.nativeToValue(this.name));
    // this.newData.monitorPointType.push(this.nativeToValue(this.monitorPointType));
    this.newData.monitorPointGroup.push(this.nativeToValue(this.monitorPointGroup));

    this.joinArray(this.nativeToValue(this.monitorPointType)).map( (val) => {
      this.newData.monitorPointType.push(val);
    });

    this.newData.alarmLevel.push(this.nativeToValue(this.alarmLevel));
    this.newData['location.northing'].push(this.nativeToValue(this.locationNorth));
    this.newData['location.easting'].push(this.nativeToValue(this.locationEast));
    this.newData['location.elevation'].push(this.nativeToValue(this.locationElevation));
  }

  joinArray(value){
    return value.split(', ');
  }
  // get value from nativeElement
  nativeToValue(e){
    if(e.nativeElement.value){
      return e.nativeElement.value;
    }
    return '';
  }

  // close modal
  close(){
    this.modalController.dismiss();
  }

  // on restore push last entry of restoreData
  restore(){
    this.newData = this.cleanData();
    this.data = this.restoreData.pop();
    this.postData();
  }

  // empty Input Data
  cleanData(){
    return {
      name: [],
      monitorPointType: [],
      monitorPointGroup: [],
      alarmLevel: [],
      'location.elevation': [],
      'location.easting': [],
      'location.northing': [],
    };
  }

}
