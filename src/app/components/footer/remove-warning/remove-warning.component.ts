import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-remove-warning',
  templateUrl: './remove-warning.component.html',
  styleUrls: ['./remove-warning.component.scss'],
})
export class RemoveWarningComponent implements OnInit {
  @Input() currentModal: any;


  constructor(
    public navParams: NavParams,
  ) { 
    this.currentModal = navParams.get('currentModal');
  }

  ngOnInit() {}

  dismiss() {
    this.currentModal.dismiss({
      'dismissed': true
    });
  }
}
