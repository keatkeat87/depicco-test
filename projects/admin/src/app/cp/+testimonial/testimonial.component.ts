import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Testimonial, TestimonialService } from '../../entities/Resource';

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


type ResourceType = Testimonial;
 
@Component({
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class TestimonialComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private testimonialService: TestimonialService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig 
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, testimonialService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {    
    return this.testimonialService.queryWatch(queryParams);
  } 

  async ngOnInit() {

    let resource = new Testimonial();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = ['avatar','name','designation'];
 
    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: false,
      search: {
        string: ['avatar','name','designation','description'],
        number: [],
        date: []
      }
    });

    this.startup();
  }


}



