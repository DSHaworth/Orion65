import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { NavbarService } from 'src/app/services/ui/navbar.service';
import { INavItem } from 'src/app/models/INavItem';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') public sidenav; //: MatSidenavModule;
  subscription: Subscription;

  constructor(
    private navbarService: NavbarService
  ) { }

  menu: INavItem[];

  ngOnInit(): void {
    this.menu = this.navbarService.getNavbarMenu();

    this.subscription = this.navbarService.sideNavToggleSubject.subscribe(()=> {
      this.sidenav.toggle();
    });       
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
