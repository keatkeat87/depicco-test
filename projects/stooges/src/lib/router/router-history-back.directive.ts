import { RouterCacheService } from './services/router-cache.service';
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
    private routerCacheService: RouterCacheService,
    private location: Location
  ) { }

  @Input()
  routerLinkCommands : any[];

  click() {
    if (this.routerCacheService.noCache) {
      let routerLinkCommands = this.routerLinkCommands || ['../'];
      this.router.navigate(routerLinkCommands, { replaceUrl: true });
    }
    else {
      this.location.back();
    }
  } 
}
