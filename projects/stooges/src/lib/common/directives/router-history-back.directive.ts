import { StoogesAppComponent } from './../../stooges-app/stooges-app.component';
import { Router } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[sRouterHistoryBack]',
  host: {
    '(click)': 'click()'
  }
})
export class RouterHistoryBackDirective {

  constructor(
    private router: Router,
    private location: Location,
    private stoogesAppComponent :StoogesAppComponent
  ) { }

  @Input()
  routerLinkCommands : any[];

  click() {
    if (this.stoogesAppComponent.hasLocationHistory) {
      let routerLinkCommands = this.routerLinkCommands || ['../'];
      this.router.navigate(routerLinkCommands, { replaceUrl: true });
    }
    else {
      this.location.back();
    }
  } 
}
