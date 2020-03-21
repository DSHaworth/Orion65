import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { INavItem } from 'src/app/models/INavItem';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  public sideNavToggleSubject: Subject<any> = new Subject<any>();

  constructor() { }

  menu: INavItem[] = [
    {
      displayName: 'Home',
      iconName: 'fas fa-angle-right',
      route: '/home',
    },
    {
      displayName: 'About',
      iconName: 'fas fa-angle-right',
      route: '/about',
    },
    {
      displayName: 'Test',
      iconName: 'fas fa-angle-right',
      route: '/test',
    }        
  ];

  getNavbarMenu(): INavItem[] {
    return this.menu;
  }

  public toggle() {
    return this.sideNavToggleSubject.next();
  }   
}
