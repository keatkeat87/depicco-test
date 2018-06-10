import { ChangeDetectorRef, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCPTableConfig } from '../../table/cp-table-config';
import { Entity, EntityConstructor } from '../../../types';
import { AbstractTableComponent } from '../../table/abstract-table.component';
import { YoutubeLoadingService } from '../../../common/services/youtube-loading.service';
import { StoogesAppComponent } from '../../../stooges-app/stooges-app.component';
import { MatConfirmDialogService, MatConfirmDialogResult } from '../confirm-dialog/confirm.service';
import { MatTableGenerateEditRouterLink } from './types';
import { TableService } from '../../table/table.service';


/*
   future : 
   以后可能会实现让用户自定义 displayColumns
   到时就可以不需要 language 的概念的

   目前 extends concept 下不支持 $expand and $select, 
   因为 extends concept 下 resource service 是动态的, $expand/$select 语法也必须是动态的
   但目前想不到一个解释的方式自动化，需要也还没有出现就留到以后做了
   /,(?![^()]*\))/g  <-- 这个正则可以 split 不在括弧里面的逗号, 以后会用到的.
*/
export abstract class MatAbstractCPTableComponent<ResourceType extends Entity> extends AbstractTableComponent<ResourceType> {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    stoogesAppComponent: StoogesAppComponent,
    tableConfig: MatCPTableConfig,
    tableService: TableService,
    injector: Injector,
    protected confirmDialogService: MatConfirmDialogService,
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent, tableConfig, tableService, injector);
  }


  // 要特别就 override
  protected async confirmBeforeRemoveAsync(_resource: ResourceType): Promise<MatConfirmDialogResult> {
    return this.confirmDialogService.confirmAsync('Confirm remove ?');
  }

  generateEditRouterLink: MatTableGenerateEditRouterLink<ResourceType> = (resource) => {
    let path = 'edit';
    if (this.hasExtendsConcept) {
      path += '-' + ((resource as Object).constructor as EntityConstructor).className;
    }
    return [resource.Id.toString(), path];
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

  async updateSort() {
    if (this.lastMoveSortIndex != null) {
      const a = this.draggingData;
      const b = this.draggingDatasPositionCache[this.lastMoveSortIndex];
      this.youtubeLoading.start();
      await this.mainResourceService.changeSortAsync(a!['sort'], b['sort']).catch(() => {
        this.resources = [...this.draggingDatasPositionCache]; //失败就还原
      });
      this.cdr.markForCheck();
      this.youtubeLoading.end();
    }
    this.draggingData = this.lastMoveSortIndex = null;
  }

  // 因为用户操作很快, enter 的时候 popup 还没有出来, 而点击会造成 focus remove button
  // entry 就会触发 2 次, 所以要在这里阻挡
  private removeLock = false;
  async remove(resourceId: number) {
    if (!this.removeLock) {
      this.removeLock = true;
      const resource = this.resources.find(r => r.Id == resourceId)!;
      const result = await this.confirmBeforeRemoveAsync(resource);
      this.cdr.markForCheck();
      this.removeLock = false;
      if (result == 'ok') {
        this.youtubeLoading.start();
        await this.mainResourceService.deleteAsync(resourceId).catch(() => { });
        this.youtubeLoading.end();
      }
    }
  }
}
