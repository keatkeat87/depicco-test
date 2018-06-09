import { odataNameSpaceWithoutHash } from '../../../entity/types';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, debounceTime, startWith, distinctUntilChanged, skip, pairwise, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatCPTableConfig } from './cp-table-config';
import { Entity, QueryParams, EntityConstructor, CompareWith } from '../../../types';
import { AbstractTableComponent } from '../../table/abstract-table.component';
import { YoutubeLoadingService } from '../../../common/services/youtube-loading.service';
import { StoogesAppComponent } from '../../../stooges-app/stooges-app.component';
import { AbstractResourceService } from '../../../entity/services/abstract-resource.service';
import { isValidDate } from '../../../common/methods/is-valid-date';
import { toOdataSpecialCharacter } from '../../../common/methods/to-odata-special-character';
import { MatConfirmDialogService, MatConfirmDialogResult } from '../confirm-dialog/confirm.service';
import { KeyAndTControl } from '../../table/types';
import { MatTableGenerateRowNgClassFn, MatTableGenerateEditRouterLink, EntityItem } from './types';
import { Observable } from 'rxjs';
import { MatSimpleSelectComponentGetValueOrDisplayFn } from '../accessors/simple-select/simple-select.component';
import { ServiceMetadata } from '../../../decorators/Service';
import { METADATA_KEY } from '../../../decorators/metadata-key';
import { DisplayNameMetadata } from '../../../decorators/DisplayName';
import { ExtendsMetadata } from '../../../decorators/Extends';
import { odataType } from '../../../entity/types';
import { TControl } from '../../table/models/TControl';
import { TableService } from '../../table/table.service';
import { TableSettingSearch } from '../../table/models/TableSetting';

/*
   future : 
   以后可能会实现让用户自定义 displayColumns
   到时就可以不需要 language 的概念的
*/
export abstract class MatAbstractCPTableComponent<ResourceType extends Entity> extends AbstractTableComponent<ResourceType> {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    /**
     * use for delete and update sort
     */
    protected resourceService: AbstractResourceService<ResourceType>,
    protected confirmDialogService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    protected tableConfig: MatCPTableConfig,
    // use for extends concept
    protected tableService: TableService,
    protected injector?: Injector
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent);
  }

  // 要特别就 override
  protected async confirmBeforeRemoveAsync(_resource: ResourceType): Promise<MatConfirmDialogResult> {
    return this.confirmDialogService.confirmAsync('Confirm remove ?');
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

  displayedColumns: string[]
  keyAndTControls: KeyAndTControl[]
  generateRowNgClassFn: MatTableGenerateRowNgClassFn<ResourceType>

  search = new FormControl('');
  private defaultLanguage: string;
  supportedLanguage: string[]
  language = new FormControl(undefined);

  // 有 link 的话, search key 会被 convert to currect language 
  // 比如外面写 'title_en' 但是 language 是 cn, 那么 会变成 search 'title_cn'
  protected searchLinkWithLanguage = true;
  protected displayColumnsLinkWithLanguage = true;

  generateEditRouterLink: MatTableGenerateEditRouterLink<ResourceType> = (resource) => {
    let path = 'edit';
    if (this.hasExtendsConcept()) {
      path += '-' + ((resource as Object).constructor as EntityConstructor).className;
    }
    return [resource.Id.toString(), path];
  }

  // override 
  sortBy(sortKey: string) {
    if (this.hasExtendsConcept()) {
      let { key } = this.splitColumnKey(sortKey);
      this.patchQueryParams({ sort: this.generateSortKeyOnSortBy(key) });
    }
    else {
      super.sortBy(sortKey);
    }
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
  private hasExtendsConcept(): boolean {
    return !!this.rootEntity;
  }
  protected rootEntity: EntityConstructor
  protected projectEntities: EntityConstructor[]
  private fullEntityItems: EntityItem<ResourceType>[] = [];
  withoutAbstractEntityItems: EntityItem<ResourceType>[] = [];
  selectedEntityItems = new FormControl([]);
  private isSelectedAllEntityItems() {
    let selectedEntityItems = this.selectedEntityItems.value as EntityItem<ResourceType>[];
    return selectedEntityItems.length == 0 || selectedEntityItems.length == this.fullEntityItems.length;
  }
  entityItemSelectGetValue: MatSimpleSelectComponentGetValueOrDisplayFn<EntityItem<ResourceType>> = (item) => {
    return item;
  }
  entityItemSelectGetDisplay: MatSimpleSelectComponentGetValueOrDisplayFn<EntityItem<ResourceType>> = (item) => {
    return item.displayName;
  }
  entityItemSelectCompareWith: CompareWith<EntityItem<ResourceType>> = (a, b) => {
    return a.Class === b.Class;
  }
  protected getNiceParentEntityItemBySelectedEntityItems(): EntityItem<ResourceType> {
    // 通过 selected entity items 向上查找出适合的 parent 来作为 抽象 resourceService, 这样才能满足 orderby
    if (this.isSelectedAllEntityItems()) {
      return this.fullEntityItems.find(f => f.Class == this.rootEntity)!;
    }
    else {
      let selectedEntityItems: EntityItem<ResourceType>[] = this.selectedEntityItems.value;
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
  private getAncestorEntityItems(target: EntityItem<ResourceType>): EntityItem<ResourceType>[] {
    let ancestors: EntityItem<ResourceType>[] = [];
    let temp = target;
    while (temp.parent) {
      temp = temp.parent;
      ancestors.push(temp);
    }
    return ancestors;
  }

  private getDescendantEntityItems(target: EntityItem<ResourceType>): EntityItem<ResourceType>[] {
    let descendants: EntityItem<ResourceType>[] = [];
    let tempEntities = [target];
    while (tempEntities.length) {
      let children = this.fullEntityItems.filter(e => tempEntities.some(te => e.parent == te));
      descendants = descendants.concat(children);
      tempEntities = children;
    }
    return descendants;
  }

  // override
  startup() {

    // search  
    this.activatedRoute.queryParamMap.pipe(
      map(q => q.get('search')),
      distinctUntilChanged()
    ).subscribe(search => {
      this.search.setValue(search || '');
      this.cdr.markForCheck();
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
      startWith([null, this.activatedRoute.snapshot.queryParamMap.get('search')])
    ).subscribe(([prevLanguage, currLanguage]) => {
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
      this.cdr.markForCheck();
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


    // Extends concept
    if (this.hasExtendsConcept()) {
      type EntityAndParent = { entity: EntityConstructor, parent: null | EntityItem<ResourceType> };
      let tempEntityAndParents: EntityAndParent[] = [{ entity: this.rootEntity, parent: null }];

      for (let i = 0; i < Number.MAX_VALUE; i++) {
        let nextTempEntityAndParents: EntityAndParent[] = [];

        tempEntityAndParents.forEach(tempEntityAndParent => {
          // convert to entityItem and push to final
          let tempEntity = tempEntityAndParent.entity;
          let serviceMetadata: ServiceMetadata = Reflect.getMetadata(METADATA_KEY.Service, tempEntity);
          let service = this.injector!.get(serviceMetadata.getConstructor());
          let displayNameMetadata: DisplayNameMetadata = Reflect.getMetadata(METADATA_KEY.TableDisplayName, tempEntity) || Reflect.getMetadata(METADATA_KEY.DisplayName, tempEntity);
          let entityItem: EntityItem<ResourceType> = {
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
        key: odataType,
        tControl: new TControl({
          displayName: 'Type',
          sortable: false,
          cellType: 'OdataType'
        })
      });

      this.queryParamKeysForAjax.push('entities');

      this.activatedRoute.queryParamMap.pipe(
        map(q => q.get('entities')),
        distinctUntilChanged() 
      ).subscribe(entitiesJson => {
        if (entitiesJson) {
          let entities: string[] = entitiesJson.split(',');
          let entityItems = this.withoutAbstractEntityItems.filter(e => entities!.some(entityString => entityString == e.Class.className));
          this.selectedEntityItems.setValue(entityItems);
        }
        else {
          this.selectedEntityItems.setValue([]);
        }
        let niceParentEntityItem = this.getNiceParentEntityItemBySelectedEntityItems();
        let ancestors = this.getAncestorEntityItems(niceParentEntityItem);
        let canSortClassNames = [niceParentEntityItem, ...ancestors].map(e => e.Class.className);
        this.keyAndTControls = this.keyAndTControls.map(keyAndTControl => {
          if (keyAndTControl.tControl.sortable && keyAndTControl.className) {
            keyAndTControl.tControl.blockSort = canSortClassNames.indexOf(keyAndTControl.className) == -1;
          }
          return keyAndTControl;
        });
        this.cdr.markForCheck();
      });

      this.selectedEntityItems.valueChanges.subscribe((entityItems: EntityItem<ResourceType>[]) => {
        let params: QueryParams = {
          entities: (entityItems.length == 0) ? null : entityItems.map(e => e.Class.className).join(',')
        }

        if (this.sort) {
          // 如果要 sort 的 key's entity 不是 niceParent 或则更上层就不能被 sort.
          let sort = this.splitColumnKey(this.sort);
          if (sort.className) { // 没有 className 的一定可以 sort
            let niceParentEntityItem = this.getNiceParentEntityItemBySelectedEntityItems();
            let ancestors = this.getAncestorEntityItems(niceParentEntityItem);  // 把所有 parent 都找出来, 这些都是 ok 的
            let okClassNames = [niceParentEntityItem].concat(ancestors).map(e => e.Class.className);
            if (okClassNames.indexOf(sort.className) == -1) {
              params.sort = null;
            }
          }
        }
        this.patchQueryParams(params);
      });
    }

    super.startup();
  }

  // override
  buildQueryParams(): QueryParams {
    let queryParams = super.buildQueryParams();

    if (this.hasExtendsConcept()) {
      const entityItems = this.selectedEntityItems.value as EntityItem<ResourceType>[];
      if (this.isSelectedAllEntityItems() || entityItems.length == 1) {
        // skip 
      }
      else {
        let filters = entityItems.map(e => `entityType eq '${toOdataSpecialCharacter(e.Class.className)}'`);
        let $filterString = `(${filters.join(' or ')})`;
        queryParams['$filter'] = (queryParams['$filter']) ? `${queryParams['$filter']} and ${$filterString}` : $filterString;
      }
    }

    const search = this.search.value;
    if (search != '') {

      const $filters: string[] = [];

      // clone 出来, 因为 extends concept 下需要修改 
      let searchConfig: TableSettingSearch = JSON.parse(JSON.stringify(this.setting.search));
      if (this.hasExtendsConcept()) {
        let niceParentEntityItem = this.getNiceParentEntityItemBySelectedEntityItems();
        let ancestors = this.getAncestorEntityItems(niceParentEntityItem);
        let descendants = this.getDescendantEntityItems(niceParentEntityItem);
        let okEntityItems = [niceParentEntityItem, ...ancestors, ...descendants];
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
                if (descendants.some(e => e.Class.className == className)) {
                  result.push(odataNameSpaceWithoutHash + columnKey); // 保留 className 和 添加完整的 odata namespace
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
          $filters.push(`contains(${s},'${toOdataSpecialCharacter(search)}')`);
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


  // sort
  /*
      sample :
      <td
      [draggable]="sort == 'sort' && !updatingSort"
      [sDragover]="draggingData && !updatingSort"
      (dragstart)="recordDragStart(data)"
      (dragenter)="draggingData && !updatingSort && moveSort(data)"
      (dragend)="draggingData && !updatingSort && updateSort()"
      >{{ data.sort }}</td>
  */
  draggingData: ResourceType | null;
  private lastMoveSortIndex: number | null;
  private draggingDatasPositionCache: ResourceType[] = [];
  recordDragStart(data: ResourceType) {
    this.draggingData = data;
    this.draggingDatasPositionCache = [...this.resources] as ResourceType[]; //记入 position
  }
  moveSort(b: ResourceType, index: number) {
    const a = this.draggingData;
    if (a == b) {
      //skip
    }
    else {
      const iposA = this.resources.indexOf(a!);
      const iposB = this.resources.indexOf(b);
      this.resources.splice(iposA, 1);
      this.resources.splice(iposB, 0, a!);
      this.lastMoveSortIndex = index; //记入最后的 position
      this.resourcesSubject.next(this.resources);
    }
  }

  private _updatingSort: boolean;
  get updatingSort() {
    return this._updatingSort;
  }
  set updatingSort(isUpdatingSort) {
    this._updatingSort = isUpdatingSort;
    if (this.youtubeLoading) {
      if (isUpdatingSort) {
        this.youtubeLoading.start();
      }
      else {
        this.youtubeLoading.end();
      }
    }
  }

  async updateSort() {
    if (this.lastMoveSortIndex != null) {
      const a = this.draggingData;
      const b = this.draggingDatasPositionCache[this.lastMoveSortIndex];
      this.updatingSort = true;
      await this.resourceService.changeSortAsync(a!['sort'], b['sort']).catch(() => {
        this.resources = [...this.draggingDatasPositionCache]; //失败就还原
      });
      this.updatingSort = false;
      this.cdr.markForCheck();
    }
    this.draggingData = this.lastMoveSortIndex = null;
  }


  // delete
  private _deletingResource: boolean;
  get deletingResource() {
    return this._deletingResource;
  }
  set deletingResource(isDeletingResource) {
    this._deletingResource = isDeletingResource;
    if (this.youtubeLoading) {
      if (isDeletingResource) {
        this.youtubeLoading.start();
      }
      else {
        this.youtubeLoading.end();
      }
    }
  }

  // 因为用户操作很快, enter 的时候 popup 还没有出来, 而点击会造成 focus remove button
  // entry 就会触发 2 次, 所以要在这里阻挡
  private removeLock = false;
  async remove(resourceId: number) {
    if (!this.removeLock) {
      this.removeLock = true;
      const resource = this.resources.find(r => r.Id == resourceId)!;
      const result = await this.confirmBeforeRemoveAsync(resource);
      this.removeLock = false;
      if (result == 'ok') {
        this.deletingResource = true;
        await this.resourceService.deleteAsync(resourceId).catch(() => { });
        this.deletingResource = false;
        this.cdr.markForCheck();
      }
    }
  }
}
