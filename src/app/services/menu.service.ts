import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private openSubmenuEvent: Subject<boolean> = new Subject<boolean>();

  private submenuOpen = false;
  constructor() { }

  public subscribeOpenSubmenu(){
    return this.openSubmenuEvent;
  }

  public openSubmenu(){
    if(this.submenuOpen){
      this.closeSubmenu();
      return;
    }
    this.submenuOpen = true;

    this.openSubmenuEvent.next(this.submenuOpen);
  }

  public closeSubmenu(){
    this.submenuOpen = false;
    this.openSubmenuEvent.next(this.submenuOpen);
  }
}
