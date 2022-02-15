import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataEventsService } from 'src/app/services/data-events.service';
import { FormGroup, FormBuilder, Validators, FormGroupName } from "@angular/forms";

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss'],
})

export class AddTagComponent implements OnInit {
  public tags: any;
  public color: any;
  public selectedTag: any;
  public sTagName: any;
  public addTagForm: FormGroup;
  public isSubmitted: boolean;

  @Input('modalController') modalController: any;

  constructor(
    private dataEventSvc: DataEventsService,
    public formBuilder: FormBuilder,
  ) {
    this.addTagForm = this.formBuilder.group({
      tagName: ['', [Validators.required]],
      colorPicker: [{value:'', disabled: true}],
      hex: [{value:'', disabled: true}, [Validators.required]],
      selectTag: ['', [Validators.required]],
    });
   }

  ngOnInit() {
    this.dataEventSvc.getTags().subscribe((tags: any) => {
      this.tags = tags;
    })
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  selectTag(tag: any) {
    this.selectedTag = tag;
    this.sTagName  = tag.title.toLowerCase();

    this.addTagForm.controls['selectTag'].setValue(this.sTagName);

    if(this.sTagName == 'status') {
      this.addTagForm.controls['colorPicker'].enable();
      this.addTagForm.controls['hex'].enable();
    }else {
      this.addTagForm.controls['colorPicker'].disable();
      this.addTagForm.controls['hex'].disable();
    }
  } 

  submit(e: any) {
    this.isSubmitted = true;
    if (this.addTagForm.valid) {
      console.log(this.addTagForm.value);
      let tag = this.tags.find((item: any) => item.id == this.selectedTag.id);

      let newTag:any = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        title: this.addTagForm.value.tagName,
        icon: this.selectedTag.icon,
      }

      if(this.sTagName == 'status') {
        newTag.color = this.addTagForm.value.hex;
      }
      tag.sub.push(newTag);

      this.dismiss();
    }else {
      return false;
    }

    this.dataEventSvc.setChange(true);
  }

  get errorControl() {
    return this.addTagForm.controls;
  }

}
