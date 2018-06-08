import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VirtualRunEvent, VirtualRunEventService } from '../../entities/Resource';

import { 
  fadeInAnimation,
  StoogesAppComponent,
  YoutubeLoadingService,
  QueryParams, 
  ResourceStream,
  MatCPTableConfig,
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
    private virtualRunEventService: VirtualRunEventService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig 
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, virtualRunEventService, confirmService, stoogesAppComponent, tableConfig, tableService);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> { 
    return this.virtualRunEventService.queryWatch(queryParams);
  }
 
  async ngOnInit() {
 
    let resource = new VirtualRunEvent();
    this.keyAndTControls = this.tableService.generateTControls(resource);
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



