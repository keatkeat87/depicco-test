import { Component, OnInit, ChangeDetectionStrategy, Input, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { MatCPRowPerPageComponent } from '../row-per-page/row-per-page.component';
import { MatCPPaginationComponent } from '../pagination/pagination.component';
import { EntityConstructor, YoutubeLoadingService, StoogesAppComponent, Entity, QueryParams } from '../../../../../../../stooges/src/public_api';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, SubscriptionLike, BehaviorSubject, Observable } from 'rxjs';
import { SortDirection } from '@angular/material';
// import { pairwise, map, filter, startWith } from 'rxjs/operators';

// query params sort = 'sort'
  
@Component({
  selector: 's-mat-cp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatCPTableComponent implements OnInit, AfterContentInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private stoogesAppComponent: StoogesAppComponent,
    private youtubeLoading: YoutubeLoadingService,
  ) { }

  // 相互依赖的组件
  @Input()
  rowPerPageComponent: MatCPRowPerPageComponent

  @Input()
  paginationComponent: MatCPPaginationComponent
  // 相互依赖的组件 end

  @Input()
  entity: EntityConstructor

  @Input()
  defaultDisplayedColumns: string[]

  @Input()
  defaultSort: string

  @Input()
  defaultDesc: boolean

  @Input()
  extendsConcept = false;


  public queryParamKeysForAjax: string[] = ['sort']; 
  private resourcesSubject = new BehaviorSubject<Entity[]>(undefined!);
  resources$ : Observable<Entity[]> = this.resourcesSubject.asObservable();


  
  sort : string 
  desc : boolean
  get sortDirection(): SortDirection {
    return (this.desc) ? 'desc' : 'asc';
  }
  private generateSortKeyOnSortBy(sortkey: string): string {
    let { defaultSort, defaultDesc } = this;
    defaultDesc = (defaultSort === sortkey) ? !defaultDesc : false;
    if (defaultDesc) {
      sortkey = sortkey + '-desc';
    }
    return sortkey;
  }
  sortBy(sortKey: string) {
    let queryParams: QueryParams = {
      sort: this.generateSortKeyOnSortBy(sortKey)
    }
    this.router.navigate([], {
      queryParams: Object.assign({}, this.activatedRoute.snapshot.queryParams, queryParams),
      replaceUrl: true
    });
  }
   

  ngOnInit() {
    this.subs.add(this.stoogesAppComponent.refreshEmitter.subscribe(async () => {
      await this.refreshAsync();
      this.cdr.markForCheck();
    }));

    // this.activatedRoute.queryParamMap.pipe(
    //   pairwise(),
    //   map(([prev, curr]) => [prev.get('sort'), curr.get('sort')]),
    //   filter(([prev, curr]) => prev != curr),
    //   map(([_prev, curr]) => curr),
    //   startWith(this.activatedRoute.snapshot.queryParamMap.get('search'))
    // ).subscribe(search => {
    //   this.search.setValue(search || '');
    //   this.cdr.markForCheck();
    // });

    // this.activatedRoute.queryParamMap.subscribe(queryParamMap => {
    //   // page
    //   const page = queryParamMap.get('page');
    //   this.page = (page == null) ? this.setting.page : +page;

    //   // sort and desc
    //   const sort = queryParamMap.get('sort');
    //   if (sort == null) {
    //     this.sort = this.setting.sort;
    //     this.desc = this.setting.desc;
    //   }
    //   else {
    //     this.desc = sort.endsWith('-desc');
    //     if (this.desc) {
    //       this.sort = sort.substring(0, sort.length - '-desc'.length);
    //     }
    //     else {
    //       this.sort = sort;
    //     }
    //   }

    //   // rowPerPage
    //   const rowPerPage = queryParamMap.get('rowPerPage');
    //   this.rowPerPage.setValue((rowPerPage) ? +rowPerPage : this.setting.rowPerPage);

    //   this.cdr.markForCheck();
    // });

  }

  ngAfterContentInit() {
     // 因为有相互依赖的组件所以一定要在 ContentInit 后才能做事儿.
 


  }

 

  // query watch stream's refresh 
  private refreshAsyncFn: () => Promise<void>;

  // 公开给外面方便 refresh resources, 虽然外面也可以用 stoogesAppComponent.refresh 来实现啦
  public async refreshAsync() {
    this.youtubeLoading.start();    
    await this.refreshAsyncFn();
    this.youtubeLoading.end();
  }

  private ajaxSubscription: SubscriptionLike;
  subs = new Subscription();

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
  }


  
}
