import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormGroupName } from "@angular/forms";
import { DataEventsService } from 'src/app/services/data-events.service';

@Component({
  selector: 'app-rename-option',
  templateUrl: './rename-option.component.html',
  styleUrls: ['./rename-option.component.scss'],
})
export class RenameOptionComponent implements OnInit {
  @Input() id: any;
  @Input() nodes: any;
  @Input() currentModal: any;
  @Input() flag: any;
  @Input() tag: any;
  @Input() color: any;

  name: any;
  ionicForm: FormGroup;
  isSubmitted: boolean = false;
  collection: any = 'nodes';
  cData: any;
  data: any;
  existData!: any[];
  constructor(
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataEventSvc:DataEventsService,
    public toastController: ToastController,
  ) {
    this.id = navParams.get('id');
    this.currentModal = navParams.get('currentModal');
    this.nodes = navParams.get('nodes');
    this.flag = navParams.get('flag');

    this.dataEventSvc.getAll().subscribe((data: any) => {
      this.data = data;
    });

    this.getNodeById(this.nodes, this.id);
  }

  ngOnInit() {
    if(this.tag == 'status') {
      this.ionicForm = this.formBuilder.group({
        id: this.id,
        name: ['', [Validators.required]],
        colorPicker: [this.color],
        hex: [this.color, [Validators.required]],
      });
    }else {
      this.ionicForm = this.formBuilder.group({
        id: this.id,
        name: ['', [Validators.required]],
      });
    }
  }

  async getNodeById(nodes: any, id: any) {
    nodes.map((n: any) => {
      if(n.id == id) {
        this.cData = n;
        if(this.flag == 'add') {
          this.existData = [];
          this.compareName(this.nodes, n.title, this.cData);

          this.existData.length > 0 ? n.title = n.title + `(${this.existData.length + 1})`: n.title = n.title;
        }
        this.name = n.title;
        this.dataEventSvc.generatePath(this.data, '');
      }

      if(n.sub != null) {
        this.getNodeById(n.sub, id);
      }
    });

  }

  async processForm(event: any) {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      return false;
    }else {
      let exsit = this.nodes.find((item: any) => item.title.toLowerCase() == this.ionicForm.value.name.toLowerCase()&&item.id != this.cData.id);
      
      if(exsit) {
        this.renameWarningToast(this.ionicForm.value.name);

        this.dismiss();

      }else { 
        this.cData.title = this.ionicForm.value.name;
        if(this.tag == 'status') {
          this.cData.color = this.ionicForm.value.hex;
        }

        this.dismiss();

        this.dataEventSvc.generatePath(this.data, '');
      }
    }

    this.dataEventSvc.setChange(true);
  }

  compareName(data: any, name: any, newData: any) {
    data.map((n:any) => {
      const regExp = /\(([^)]+)\)/;
      const match = n.title.match(/.+?(?=[\(])/);
      if(n.title == name&&newData.id !== n.id) {
        this.existData.push(n);
      }

      if(match != null&&match) {
        if(match[0].trim() == name&&regExp.test(n.title)&&newData.id !== n.id) {
          this.existData.push(n);
        }
      }

      if(n.sub) {
        this.compareName(n.sub, name, newData);
      }
    })

    // return data.map ( (item: any) => ({...item})).filter ( (item: any) => {
    //   if(item.title.toLowerCase().indexOf(name.toLowerCase()) > -1&&newData.id !== item.id&&newData.icon === item.icon ) {
    //     return true;
    //   }
    // });
  }
  
  async renameWarningToast(name) {
    const toast = await this.toastController.create({
      message: `The '${name}' name already exists. Please choose another file name!`,
      position: 'top',
      color: 'warning',
      duration: 2000
    });
    toast.present();
  }

  dismiss() {
    this.currentModal.dismiss({
      'dismissed': true
    });
  }

  
  get errorControl() {
    return this.ionicForm.controls;
  }
}
