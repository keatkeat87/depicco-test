import { ChangeDetectorRef, OnDestroy, TrackByFunction, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SubscriptionLike, BehaviorSubject, Observable, Subscription } from 'rxjs';

import { pairwise, distinctUntilChanged, startWith, map, filter, debounceTime, skip } from 'rxjs/operators';
import { SortDirection } from '@angular/material';
import { YoutubeLoadingService } from '../../common/services/youtube-loading.service';
import { StoogesAppComponent } from '../../stooges-app/stooges-app.component';
import { QueryParams, ResourceStream, Entity, EntityConstructor, CompareWith } from '../../types';
import { TableSetting, TableSettingSearch } from './models/TableSetting';
import { ODataCount, ODataNameSpaceWithoutHash } from '../../entity/types';
import { CPTableConfig } from '../table/cp-table-config';
import { TableService } from './table.service';
import { AbstractResourceService } from '../../entity/services/abstract-resource.service';
import { KeyAndTControl } from './types';
import { TableGenerateRowNgClassFn, TableEntityItem } from '../table/types';
import { ServiceMetadata } from '../../decorators/Service';
import { METADATA_KEY } from '../../decorators/metadata-key';
import { DisplayNameMetadata } from '../../decorators/DisplayName';
import { ExtendsMetadata } from '../../decorators/Extends';
import { TControl } from './models/TControl';
import { isValidDate } from '../../common/methods/is-valid-date';
import { toODataSpecialCharacter } from '../../common/methods/to-odata-special-character';
import { SimpleSelectGetValueOrDisplayFn } from '../types';

export abstract class AbstractTableComponent<ResourceType extends Entity> implements OnDestroy {


  protected setting: TableSetting;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected cdr: ChangeDetectorRef,
    protected youtubeLoading: YoutubeLoadingService,
    protected stoogesAppComponent: StoogesAppComponent,
    protected tableConfig: CPTableConfig,
    protected tableService: TableService,
    protected injector: Injector
  ) { }

  protected resourcesSubject = new BehaviorSubject<ResourceType[]>(undefined!);
  resources$: Observable<ResourceType[]> = this.resourcesSubject.asObservable();
  resources: ResourceType[]
  totalRow: number;
  rowPerPage = new FormControl(null);
  page: number;
  sort: string | null;
  desc: boolean;

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    let service = (this.hasExtendsConcept) ? this.niceParentEntityItem.service : this.mainResourceService;
    // hasExtendsConcept watch 全部 children 改变
    let watchEntities = (this.hasExtendsConcept) ? [this.mainEntity.entityName,...this.withoutAbstractEntityItems.map(e => e.Class.entityName)] : undefined; 
    return service.queryWatch(queryParams, watchEntities);
  }

  get sortDirection(): SortDirection {
    return (this.desc) ? 'desc' : 'asc';
  }

  protected queryParamKeysForAjax: string[] = ['page', 'rowPerPage', 'sort', 'search', 'entities', 'filter'];

  protected generateSortKeyOnSortBy(sortkey: string): string {
    let { sort, desc } = this;
    desc = (sort === sortkey) ? !desc : false;
    if (desc) {
      sortkey = sortkey + '-desc';
    }
    return sortkey;
  }

  dataSource: Observable<ResourceType[] | undefined[]> = this.resources$.pipe(map(resources => {
    if (!resources) return [];
    if (resources.length == 0) {
      return [undefined]; // 表示 not found
    }
    else {
      return resources; // 以后看怎样扩展 footer sum 
    }
  }));

  protected mainResourceService: AbstractResourceService<ResourceType>
  displayedColumns: string[]
  keyAndTControls: KeyAndTControl[]
  generateRowNgClassFn: TableGenerateRowNgClassFn<ResourceType>

  search = new FormControl('');
  private defaultLanguage: string;
  supportedLanguage: string[]
  language = new FormControl(undefined);

  // 有 link 的话, search key 会被 convert to currect language 
  // 比如外面写 'title_en' 但是 language 是 cn, 那么 会变成 search 'title_cn'
  protected searchLinkWithLanguage = true;
  protected displayColumnsLinkWithLanguage = true;
   
  sortBy(sortKey: string) { 
    this.patchQueryParams({ sort: this.generateSortKeyOnSortBy(sortKey) });    
  }

  private splitColumnKey(key: string): { className: string | null, key: string } {
    // key e.g. : Event.address.text_en
    let keys = key.split('.');
    let first = keys[0];
    let hasClassName = this.fullEntityItems.some(e => e.Class.className == first);
    return {
      className: (hasClassName) ? first : null,
      key: (hasClassName) ? keys.slice(1).join('.') : key
    }
  }

  protected hasExtendsConcept = false;
  protected mainEntity: EntityConstructor
  protected projectEntities: EntityConstructor[]
  private fullEntityItems: TableEntityItem<ResourceType>[] = [];
  withoutAbstractEntityItems: TableEntityItem<ResourceType>[] = [];
  selectedEntityItems = new FormControl([]);
  private isSelectedAllEntityItems() {
    let selectedEntityItems = this.selectedEntityItems.value as TableEntityItem<ResourceType>[];
    return selectedEntityItems.length == 0 || selectedEntityItems.length == this.fullEntityItems.length;
  }
  entityItemSelectGetValue: SimpleSelectGetValueOrDisplayFn<TableEntityItem<ResourceType>> = (item) => {
    return item;
  }
  entityItemSelectGetDisplay: SimpleSelectGetValueOrDisplayFn<TableEntityItem<ResourceType>> = (item) => {
    return item.displayName;
  }
  entityItemSelectCompareWith: CompareWith<TableEntityItem<ResourceType>> = (a, b) => {
    return a.Class === b.Class;
  }

  // 通过 selected entity items 向上查找出适合的 parent 来作为 抽象 resourceService, 这样才能满足 orderby
  protected niceParentEntityItem: TableEntityItem<ResourceType>
  protected niceParentAncestorEntityItems: TableEntityItem<ResourceType>[] = [];
  protected niceParentDescendantEntityItems: TableEntityItem<ResourceType>[] = [];
  private generateNiceParentEntityItem(): TableEntityItem<ResourceType> {
    if (this.isSelectedAllEntityItems()) {
      return this.fullEntityItems.find(f => f.Class == this.mainEntity)!;
    }
    else {
      let selectedEntityItems: TableEntityItem<ResourceType>[] = this.selectedEntityItems.value;
      // step : 
      // 先把所有人提升至最高 layer 
      // 然后 distinct 
      // 如果不是剩下最后一个, 那么全部 up layer, 再 distinct, 一直到剩下最后一个. 
      let highestLayer = selectedEntityItems.max(s => s.layer);
      selectedEntityItems = selectedEntityItems.map(s => {
        if (s.layer > highestLayer) {
          let needUpLayer = s.layer - highestLayer;
          let tempEntityItem = s;
          for (let i = 0; i < needUpLayer; i++) {
            tempEntityItem = s.parent!;
          }
          return tempEntityItem;
        }
        else {
          return s;
        }
      }).distinct();
      while (selectedEntityItems.length != 1) {
        selectedEntityItems = selectedEntityItems.map(s => {
          return s.parent!;
        }).distinct();
      }
      return selectedEntityItems[0];
    }
  }
  private getAncestorEntityItems(target: TableEntityItem<ResourceType>): TableEntityItem<ResourceType>[] {
    let ancestors: TableEntityItem<ResourceType>[] = [];
    let temp = target;
    while (temp.parent) {
      temp = temp.parent;
      ancestors.push(temp);
    }
    return ancestors;
  }
  private getDescendantEntityItems(target: TableEntityItem<ResourceType>): TableEntityItem<ResourceType>[] {
    let descendants: TableEntityItem<ResourceType>[] = [];
    let tempEntities = [target];
    while (tempEntities.length) {
      let children = this.fullEntityItems.filter(e => tempEntities.some(te => e.parent == te));
      descendants = descendants.concat(children);
      tempEntities = children;
    }
    return descendants;
  }

  trackById: TrackByFunction<ResourceType> = (index, item) => {
    if (!item) return index;
    return item.Id;
  }

  trackByIndex: TrackByFunction<any> = (index: number) => {
    return index;
  }

  protected startup() {
 
    // search  
    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('search')),
      distinctUntilChanged()
    ).subscribe(search => {
      this.cdr.markForCheck();
      this.search.setValue(search || '');
    });

    this.search.valueChanges.pipe(
      debounceTime(500),
      startWith(this.search.value),
      distinctUntilChanged(),
      skip(1)
    ).subscribe(v => {
      if (v == '') v = null;
      this.patchQueryParams({ search: v });
    });


    // language  
    this.defaultLanguage = this.tableConfig.defaultLanguage;
    this.supportedLanguage = this.tableConfig.supportedLanguages;
    if (this.searchLinkWithLanguage) this.queryParamKeysForAjax.push('language');

    this.activatedRoute.queryParamMap.pipe(
      pairwise(),
      map(([prev, curr]) => [prev.get('language'), curr.get('language')]),
      filter(([prev, curr]) => prev != curr),
      startWith([null, this.activatedRoute.snapshot.queryParamMap.get('language')])
    ).subscribe(([prevLanguage, currLanguage]) => {
      this.cdr.markForCheck();
      this.language.setValue(currLanguage || this.defaultLanguage);
      let from = prevLanguage || this.defaultLanguage;
      let to = currLanguage || this.defaultLanguage;
      if (from == to || !this.displayColumnsLinkWithLanguage) {
        // skip
      }
      else {
        from = '_' + from;
        to = '_' + to;
        this.displayedColumns = this.displayedColumns.map(v => {
          return (v.endsWith(from)) ? v.replace(from, to) : v;
        });
      }
    });

    this.language.valueChanges.subscribe(v => {
      if (this.searchLinkWithLanguage) {
        if (!this.search.value) {
          this.queryParamKeysForAjax.remove(v => v == 'language');
        }
        else {
          this.queryParamKeysForAjax.push('language');
        }
      }
      if (v == this.defaultLanguage) v = null;
      this.patchQueryParams({ language: v });
    });


    // Extends concept setup       
    if (this.hasExtendsConcept) {
      type EntityAndParent = { entity: EntityConstructor, parent: null | TableEntityItem<ResourceType> };
      let tempEntityAndParents: EntityAndParent[] = [{ entity: this.mainEntity, parent: null }];

      for (let i = 0; i < Number.MAX_VALUE; i++) {
        let nextTempEntityAndParents: EntityAndParent[] = [];

        tempEntityAndParents.forEach(tempEntityAndParent => {
          // convert to entityItem and push to final
          let tempEntity = tempEntityAndParent.entity;
          let serviceMetadata: ServiceMetadata = Reflect.getMetadata(METADATA_KEY.Service, tempEntity);
          let service = this.injector.get(serviceMetadata.getConstructor());
          let displayNameMetadata: DisplayNameMetadata = Reflect.getMetadata(METADATA_KEY.TableDisplayName, tempEntity) || Reflect.getMetadata(METADATA_KEY.DisplayName, tempEntity);
          let entityItem: TableEntityItem<ResourceType> = {
            Class: tempEntity,
            service: service,
            isAbstract: Reflect.hasOwnMetadata(METADATA_KEY.Abstract, tempEntity),
            isRoot: i == 0,
            displayName: (displayNameMetadata) ? displayNameMetadata.name : null,
            layer: i,
            parent: tempEntityAndParent.parent
          }
          this.fullEntityItems.push(entityItem);

          // look for child
          nextTempEntityAndParents = nextTempEntityAndParents.concat(
            this.projectEntities.filter(projectEntity => {
              let extendsMetadata: ExtendsMetadata = Reflect.getMetadata(METADATA_KEY.Extends, projectEntity);
              return (extendsMetadata && extendsMetadata.getConstructor() === tempEntity);
            }).map(projectEntity => {
              return {
                entity: projectEntity,
                parent: entityItem
              }
            })
          );
        });
        if (nextTempEntityAndParents.length == 0) break;
        tempEntityAndParents = nextTempEntityAndParents;
      }
      this.withoutAbstractEntityItems = this.fullEntityItems.filter(f => !f.isAbstract);

      this.keyAndTControls = [];
      this.fullEntityItems.forEach(entityItem => {
        let resource = new entityItem.Class();
        if (entityItem.parent != null) {
          // 我们只要自己的 prop
          let parent = new entityItem.parent.Class();
          Object.keys(parent).forEach(key => {
            delete resource[key];
          });
        }
        let keyAndTControls = this.tableService!.generateTControls(resource);
        if (!entityItem.isRoot) {
          // add namespace
          keyAndTControls.forEach(keyAndTControl => {
            keyAndTControl.className = entityItem.Class.className;
            keyAndTControl.classDisplayName = entityItem.displayName!;
          });
        }
        this.keyAndTControls = this.keyAndTControls.concat(keyAndTControls);
      });
      this.keyAndTControls.unshift({
        key: 'entityType',
        tControl: new TControl({
          displayName: 'Type',
          sortable: true,
          cellType: 'ODataType'
        })
      });

      this.queryParamKeysForAjax.push('entities');

      // 第一次也要跑,所以要在 queryParams subscribe 之前监听
      this.selectedEntityItems.valueChanges.subscribe(_ => {
        this.niceParentEntityItem = this.generateNiceParentEntityItem();
        this.niceParentAncestorEntityItems = this.getAncestorEntityItems(this.niceParentEntityItem);
        this.niceParentDescendantEntityItems = this.getDescendantEntityItems(this.niceParentEntityItem);
      });

      this.activatedRoute.queryParamMap.pipe(
        map(q => q.get('entities')),
        distinctUntilChanged()
      ).subscribe(entitiesJson => {
        this.cdr.markForCheck();
        if (entitiesJson) {
          let entities: string[] = entitiesJson.split(',');
          let entityItems = this.withoutAbstractEntityItems.filter(e => entities!.some(entityString => entityString == e.Class.className));
          this.selectedEntityItems.setValue(entityItems);
        }
        else {
          this.selectedEntityItems.setValue([]);
        }
        let canSortClassNames = [this.niceParentEntityItem, ...this.niceParentAncestorEntityItems].map(e => e.Class.className);
        this.keyAndTControls = this.keyAndTControls.map(keyAndTControl => {
          if (keyAndTControl.tControl.sortable && keyAndTControl.className) {
            keyAndTControl.tControl.blockSort = canSortClassNames.indexOf(keyAndTControl.className) == -1;
          }
          return keyAndTControl;
        });
      });

      this.selectedEntityItems.valueChanges.subscribe((entityItems: TableEntityItem<ResourceType>[]) => {
        let params: QueryParams = {
          entities: (entityItems.length == 0) ? null : entityItems.map(e => e.Class.className).join(',')
        }    

        if (this.sort) {
          // 如果要 sort 的 key's entity 不是 niceParent 或则更上层就不能被 sort.
          let sort = this.splitColumnKey(this.sort);
          if (sort.className) { // 没有 className 的一定可以 sort

            let okClassNames = [this.niceParentEntityItem, ...this.niceParentAncestorEntityItems].map(e => e.Class.className);
            if (okClassNames.indexOf(sort.className) == -1) {
              params.sort = null;
            }
          }
        }
        this.patchQueryParams(params);
      });
    }
    else {
      let resource = new this.mainEntity();
      this.keyAndTControls = this.tableService.generateTControls(resource);
    }

    let serviceMetadata: ServiceMetadata = Reflect.getMetadata(METADATA_KEY.Service, this.mainEntity);
    this.mainResourceService = this.injector.get(serviceMetadata.getConstructor());
 
    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('page')),
      distinctUntilChanged()
    ).subscribe(page => {
      this.cdr.markForCheck();
      this.page = (page == null) ? this.setting.page : +page;
    });

    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('sort')),
      distinctUntilChanged()
    ).subscribe(sort => {
      this.cdr.markForCheck();
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
    });

    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('rowPerPage')),
      distinctUntilChanged()
    ).subscribe(rowPerPage => {
      this.cdr.markForCheck();
      this.rowPerPage.setValue((rowPerPage) ? +rowPerPage : this.setting.rowPerPage);
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

    this.activatedRoute.queryParamMap.pipe(
      pairwise(),
      filter(([prev, curr]) => this.queryParamKeysForAjax.some(key => prev.get(key) !== curr.get(key)))
    ).subscribe(_ => {
      this.cdr.markForCheck();
      this.ajax();
    });

    this.ajax(); // 第一次一定要 ajax 啦

    // Global refresh
    this.subs.add(this.stoogesAppComponent.refreshEmitter.subscribe(async () => {
      await this.refreshAsync();
      this.cdr.markForCheck();
    }));

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
      let sort = (this.hasExtendsConcept) ? this.splitColumnKey(this.sort).key : this.sort;
      sort = sort.split('.').join('/'); // convert '.' to '/' for odata (我们都是用 '.' 表示层中层, 不过 odata 却用 '/')
      queryParams['$orderby'] = sort + ((this.desc) ? ' desc' : '');
    }

    // filter entityType
    if (this.hasExtendsConcept) {
      const entityItems = this.selectedEntityItems.value as TableEntityItem<ResourceType>[];
      if (this.isSelectedAllEntityItems() || entityItems.length == 1) {
        // skip 
      }
      else {
        let filters = entityItems.map(e => `entityType eq '${toODataSpecialCharacter(e.Class.className)}'`);
        let $filterString = `(${filters.join(' or ')})`;
        queryParams['$filter'] = (queryParams['$filter']) ? `${queryParams['$filter']} and ${$filterString}` : $filterString;
      }
    }

    const search = this.search.value;
    if (search != '') {

      const $filters: string[] = [];

      // clone 出来做调整 
      // . convert to /
      // extends concept 下也要特别处理那些有 className 的 columnKey
      let searchConfig: TableSettingSearch = JSON.parse(JSON.stringify(this.setting.search));
      if (this.hasExtendsConcept) {

        let okEntityItems = [this.niceParentEntityItem, ...this.niceParentAncestorEntityItems, ...this.niceParentDescendantEntityItems];
        // 依据 niceParent 做处理, 不在范围的要 remove, 在祖先的要 remove className, 在子孙的要添加 odata namspace
        // note : Class.complex.key -> OData.Namespace.Class/complex/key 最终版有 . 也有 / 哦
        // e.g. : VirtualRun.address.text -> Project.Entity.VirtualRun/address/text
        let removeAndConvert = (columnKeys: string[]) => {
          return columnKeys.reduce<string[]>((result, columnKey) => {
            let { className, key } = this.splitColumnKey(columnKey);
            columnKey = columnKey.split('.').join('/');
            key = key.split('.').join('/');
            if (className) {
              if (okEntityItems.every(e => e.Class.className != className)) {
                // remove it 
              }
              else {
                if (this.niceParentDescendantEntityItems.some(e => e.Class.className == className)) {
                  result.push(ODataNameSpaceWithoutHash + columnKey); // 保留 className 和 添加完整的 odata namespace
                }
                else {
                  // 不是 descendants 就是 niceParentEntityItem or ancestors, 这时我们不需要 className
                  result.push(key);
                }
              }
            }
            else {
              result.push(key);
            }
            return result;
          }, []);
        }

        if (searchConfig.string) {
          searchConfig.string = removeAndConvert(searchConfig.string);
        }
        if (searchConfig.number) {
          searchConfig.number = removeAndConvert(searchConfig.number);
        }
        if (searchConfig.date) {
          searchConfig.date = removeAndConvert(searchConfig.date);
        }
      }
      else {
        // 不是 extends concept 只要 convert . to / 就够了
        if (searchConfig.string) {
          searchConfig.string = searchConfig.string.map(s => s.split('.').join('/'));
        }
        if (searchConfig.number) {
          searchConfig.number = searchConfig.number.map(s => s.split('.').join('/'));
        }
        if (searchConfig.date) {
          searchConfig.date = searchConfig.date.map(s => s.split('.').join('/'));
        }
      }

      let strings = searchConfig.string;
      if (strings) {
        if (this.searchLinkWithLanguage) {
          strings = strings.map(v => {
            if (v.endsWith('_' + this.defaultLanguage)) {
              return v.replace('_' + this.defaultLanguage, '_' + this.language.value);
            }
            return v;
          })
        }

        strings.forEach(s => {
          $filters.push(`contains(${s},'${toODataSpecialCharacter(search)}')`);
        });
      }

      let finalSearch = search;
      const firstChar = search.charAt(0);
      if (firstChar == '>' || firstChar == '<') finalSearch = search.substring(1);
      let operator = 'eq';
      if (firstChar == '>') operator = 'ge';
      if (firstChar == '<') operator = 'le';

      const numbers = searchConfig.number;
      if (numbers && !isNaN(finalSearch as any)) {
        numbers.forEach(n => {
          $filters.push(`${n} ${operator} ${finalSearch}`);
        });
      }

      const dates = searchConfig.date;
      if (dates && isValidDate(new Date(finalSearch)) && finalSearch.length >= 4) {
        dates.forEach(d => {
          $filters.push(`${d} ${operator} ${new Date(finalSearch).toDateString()}`);
        });
      }
      let $filterString = `(${$filters.join(' or ')})`;
      queryParams['$filter'] = (queryParams['$filter']) ? `${queryParams['$filter']} and ${$filterString}` : $filterString;
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
      this.cdr.markForCheck();
      if (!firstLoadDataDone) {
        // stream 只有第一次是这里触发, 其余是因为其它地方改变数据刷新, 这里会直接获取到资料的, 所以不会有 loading 之类的情况
        firstLoadDataDone = true;
        this.youtubeLoading.end();
      }
      this.resources = resources;
      this.resourcesSubject.next(resources);
      this.totalRow = resources[ODataCount];
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


