import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormGroupName } from "@angular/forms";
import { DataEventsService } from 'src/app/services/data-events.service';
@Component({
  selector: 'app-color-option',
  templateUrl: './color-option.component.html',
  styleUrls: ['./color-option.component.scss'],
})
export class ColorOptionComponent implements OnInit {
  @Input() currentModal: any;
  @Input() tag: any;
  ionicForm: FormGroup;
  isSubmitted: boolean = false;
  color: any;

  constructor(
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public dataEventSvc:DataEventsService,
  ) {
    this.currentModal = navParams.get('currentModal');
    this.tag = navParams.get('tag');
    this.color = this.tag.color;

    this.ionicForm = this.formBuilder.group({
      colorPicker: [this.color],
      hex: [this.color, [Validators.required]],
    });
   }

  ngOnInit() {}

  get errorControl() {
    return this.ionicForm.controls;
  }
  
  async processForm(event: any) {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      return false;
    }else {
      this.tag.color = this.ionicForm.value.hex;
    }

    this.dataEventSvc.setChange(true);
    this.dismiss();
  }

  dismiss() {
    this.currentModal.dismiss({
      'dismissed': true
    });
  }

}
