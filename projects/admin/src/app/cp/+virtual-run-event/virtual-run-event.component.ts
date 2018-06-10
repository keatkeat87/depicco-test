import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VirtualRunEvent } from '../../entities/Resource';

import { 
  fadeInAnimation,
  StoogesAppComponent,
  YoutubeLoadingService,
  CPTableConfig,
  MAT_CP_TABLE_CONFIG,
  TableService,
  MatAbstractCPTableComponent,
  MatConfirmDialogService,
  TableSetting
} from '../../../../../stooges/src/public_api';


type ResourceType = VirtualRunEvent;
 
@Component({
  templateUrl: './virtual-run-event.component.html',
  styleUrls: ['./virtual-run-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class VirtualRunEventComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: CPTableConfig,
    injector: Injector,
    confirmService: MatConfirmDialogService,
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent, tableConfig, tableService, injector, confirmService);
  }
 
  async ngOnInit() {
 
    this.mainEntity = VirtualRunEvent;
    this.displayedColumns = ['Id', 'image', 'title', 'registerDeadline', 'startRunDate', 'endRunDate', 'registerAmount', 'participant', 'group'];
    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: true,
      search: {
        string: ['title', 'group'],
        number: ['registerAmount', 'participant'],
        date: ['registerDeadline', 'startRunDate', 'endRunDate']
      }
    });

    this.startup();
  }


}



