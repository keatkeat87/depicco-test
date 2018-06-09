import { ChangeDetectorRef, OnDestroy, TrackByFunction } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionLike, BehaviorSubject, Observable, Subscription } from 'rxjs';

import { pairwise, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { SortDirection } from '@angular/material';
import { YoutubeLoadingService } from '../../common/services/youtube-loading.service';
import { StoogesAppComponent } from '../../stooges-app/stooges-app.component';
import { QueryParams, ResourceStream, Entity } from '../../types';
import { TableSetting } from './models/TableSetting';

export abstract class AbstractTableComponent<ResourceType extends Entity> implements OnDestroy {

  protected abstract getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]>;

  setting: TableSetting;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected cdr: ChangeDetectorRef,
    protected youtubeLoading: YoutubeLoadingService,
    protected stoogesAppComponent: StoogesAppComponent
  ) { }

  protected resourcesSubject = new BehaviorSubject<ResourceType[]>(undefined!);
  resources$ : Observable<ResourceType[]> = this.resourcesSubject.asObservable();
  resources: ResourceType[]
  totalRow: number;
  rowPerPage = new FormControl(null);
  page: number;
  sort: string | null;
  desc: boolean;
  get sortDirection(): SortDirection {
    return (this.desc) ? 'desc' : 'asc';
  }

  protected queryParamKeysForAjax: string[] = [];
 
  protected generateSortKeyOnSortBy(sortkey: string): string {
    let { sort, desc } = this;
    desc = (sort === sortkey) ? !desc : false;
    if (desc) {
      sortkey = sortkey + '-desc';
    }
    return sortkey;
  }
  
  sortBy(sortKey: string) {
    this.patchQueryParams({ sort: this.generateSortKeyOnSortBy(sortKey) });
  }

  trackById: TrackByFunction<ResourceType> = (index, item) => {
    if (!item) return index;
    return item.Id;
  }

  trackByIndex: TrackByFunction<any> = (index: number) => {
    return index;
  }

  subscribeQueryParamMap(keys: string[], runFirstTime = true): void {

  }

  protected startup() {
    this.queryParamKeysForAjax = [
      ...this.queryParamKeysForAjax,
      'page', 'sort', 'rowPerPage'
    ];

    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('page')),
      distinctUntilChanged()
    ).subscribe(page => {
      this.page = (page == null) ? this.setting.page : +page;
      this.cdr.markForCheck();
    });

    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('sort')),
      distinctUntilChanged()
    ).subscribe(sort => {
      if (sort == null) {
        this.sort = this.setting.sort;
        this.desc = this.setting.desc;
      }
      else {
        this.desc = sort.endsWith('-desc');
        if (this.desc) {
          this.sort = sort.substring(0, sort.length - '-desc'.length);
        }
        else {
          this.sort = sort;
        }
      }
      this.cdr.markForCheck();
    });

    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('rowPerPage')),
      distinctUntilChanged()
    ).subscribe(rowPerPage => {
      this.rowPerPage.setValue((rowPerPage) ? +rowPerPage : this.setting.rowPerPage);
      this.cdr.markForCheck();
    });
 
    // rowPerPage value change
    this.rowPerPage.valueChanges.pipe(
      startWith(this.rowPerPage.value),
      distinctUntilChanged(),
      pairwise()
    ).subscribe(([prev, current]) => {
      //变大变小, page 始终依据 row 1 data 调整
      const queryParams: Params = {
        rowPerPage: (current == this.setting.rowPerPage) ? null : current
      };
      const { page } = this;
      const firstRow = (page - 1) * prev + 1;
      const nextRowPerPage = current;
      const nextPage = Math.ceil(firstRow / nextRowPerPage);
      if (nextPage != page) queryParams['page'] = nextPage;
      this.patchQueryParams(queryParams);
    });
 

    this.activatedRoute.queryParamMap.pipe(pairwise()).subscribe(([prev, curr]) => {
      let needAjax = this.queryParamKeysForAjax.some(key => prev.get(key) !== curr.get(key));
      if (needAjax) {
        this.ajax();
        this.cdr.markForCheck();
      }
    });

      // Global refresh
      this.subs.add(this.stoogesAppComponent.refreshEmitter.subscribe(async () => {
        await this.refreshAsync();
        this.cdr.markForCheck();
      }));

    this.ajax(); // 第一次一定要 ajax 啦
  }

  private refreshAsyncFn: () => Promise<void>;
  async refreshAsync() {
    this.youtubeLoading.start();
    await this.refreshAsyncFn();
    this.youtubeLoading.end(); 
  }

  protected buildQueryParams(): QueryParams {
    const queryParams = {};

    Object.assign(queryParams, {
      '$count': 'true',
      '$skip': ((this.page - 1) * this.rowPerPage.value).toString(),
      '$top': this.rowPerPage.value.toString()
    });
    if (this.sort) {
      let sort = this.sort.split('.').join('/'); // convert '.' to '/' for odata (我们都是用 '.' 表示层中层, 不过 odata 却用 '/')
      queryParams['$orderby'] = sort + ((this.desc) ? ' desc' : '');
    }

    return queryParams;
  }

  private ajax() {
    let queryParams = this.buildQueryParams();
    const { data$, subscription, refreshAsync } = this.getResourcesStream(queryParams);
    this.refreshAsyncFn = refreshAsync;
    if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
    this.ajaxSubscription = subscription;
    this.youtubeLoading.start();
    let firstLoadDataDone = false;
    data$.subscribe(resources => {
      if (!firstLoadDataDone) {
        // stream 只有第一次是这里触发, 其余是因为其它地方改变数据刷新, 这里会直接获取到资料的, 所以不会有 loading 之类的情况
        firstLoadDataDone = true;
        this.youtubeLoading.end();
      }
      this.resources = resources;
      this.resourcesSubject.next(resources);
      this.totalRow = resources['@odata.count'];
      this.cdr.markForCheck();
    });
  }

  patchQueryParams(queryParams: Params, replaceUrl = true) {
    this.router.navigate([], {
      queryParams: Object.assign({}, this.activatedRoute.snapshot.queryParams, queryParams),
      replaceUrl: replaceUrl
    });
  }

  
  private ajaxSubscription: SubscriptionLike;
  subs = new Subscription();

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
  }

}


