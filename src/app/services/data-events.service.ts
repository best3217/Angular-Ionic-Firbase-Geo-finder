/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { ApiService } from "./api.service"
@Injectable({
  providedIn: 'root'
})

export class DataEventsService {
  public nodeEvent: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public menuEvent: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public tagEvent: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public searchDataEvent: BehaviorSubject<string> = new BehaviorSubject('');
  public filterDataEvent: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public checkedEvent: BehaviorSubject<any> = new BehaviorSubject(0);
  public FilterSelectAllEvent: Subject<boolean> = new Subject();
  public changeEvent: Subject<boolean> = new Subject();
  private data: any[];
  private tags: any[];
  public fNode: any;
  public checkedNum: number;

  constructor(
    public toastController: ToastController,
  ) {
  }

  /** */
  setAll(nodes: any) {
    this.data = nodes;
    this.nodeEvent.next(this.data);
  }

  getAll() {
    return this.nodeEvent
  }

  async getDataByPID(nodes: any, pId: any) {
    this.fetchByPId(nodes, pId);
    return this.fNode;
  }
 
  fetchByPId(nodes: any, pId: any) {
    nodes.map((node: any) => {
      if (node.id == pId) {
        this.fNode = node;
        return node;
      } else if (node.sub != null) {
        this.fetchByPId(node.sub, pId);
      }
    });
  }

  async getDataByID(nodes: any, pId: any) {
    this.fetchById(nodes, pId);
    return this.fNode;
  }

  fetchById(nodes, id) {
    nodes.map((node: any) => {
      if (node.id == id) {
        this.fNode = node;
        return node;
      } else if (node.sub != null) {
        this.fetchByPId(node.sub, id);
      }
    })
  }

  setSearchedData(data: any) {
    this.searchDataEvent.next(data);
  }

  getSearchData() {
    return this.searchDataEvent;
  }

  generatePath(nodes: any, parentPath: any) {
    if(nodes) {
      nodes.map((n: any) => {
        parentPath ? n.path = `${parentPath}/${n.title}` : n.path = n.title;
        this.generatePath(n.sub, n.path);
        if(n.sub) {
          this.generatePath(n.sub, n.path);
        }
      });
    }
  }

  setTags(tags: any[]) {
    this.tags = tags;
    this.tagEvent.next(tags);
  }
  
  getTags() {
    return this.tagEvent;
  }

  fetchCheckedNode() {
    this.checkedNum = 0;
    this.retrieveNode(this.data);
    this.checkedEvent.next(this.checkedNum);
  }

  getCheckedNum() {
    return this.checkedEvent; 
  }

  retrieveNode(nodes: any) {
    nodes.map((n: any) => {
      if(n.isChecked) {
        this.checkedNum++
      }
      if(n.sub) {
        this.retrieveNode(n.sub);
      }
    });
  }

  setChange(e) {
    this.changeEvent.next(e);
  }

  getChange() {
    return this.changeEvent;
  }

  setFilteredData(data: any) {
    this.filterDataEvent.next(data);
  }

  getFilteredData() {
    return this.filterDataEvent;
  }

  getFilterSelectAllEvent() {
    return this.FilterSelectAllEvent;
  }

  setFilterSelectAllEvent(e: boolean) {
    return this.FilterSelectAllEvent.next(e);
  }
}