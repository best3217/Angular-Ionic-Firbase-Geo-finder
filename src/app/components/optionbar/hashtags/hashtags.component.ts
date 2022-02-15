import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.scss'],
})
export class HashtagsComponent implements OnInit {
  @Input() menu: any;
  @Input() currentModal: any;
  public hashtag: any;
  constructor(
    public navParams: NavParams,
  ) { 
    this.menu = navParams.get('menu');
    this.currentModal = navParams.get('currentModal');
  }

  ngOnInit() {
    this.hashtag = this.menu.find(m => m.title.toLowerCase() === 'hashtags');
  }

  dismiss() {
    this.currentModal.dismiss({
      'dismissed': true
    });
  }

}
