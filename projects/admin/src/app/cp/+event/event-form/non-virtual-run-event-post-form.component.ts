import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { NonVirtualRunEvent, NonVirtualRunEventService } from '../../../entities/Resource';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class NonVirtualRunEventPostFormComponent extends AbstractSimplePostFormComponent<NonVirtualRunEvent> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    nonVirtualRunEventService: NonVirtualRunEventService,
    edmFormService: FormService
  ) {
    super(cdr, nonVirtualRunEventService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = [
      'image', 'title', 'urlTitle', 'registerDeadline', 'startRunDate', 
      'endRunDate', 'registerAmount', 'participant', 'summary', 'description',
      'googleFormLink', 'location', 'startRunTime', 'endRunTime'
    ];
    this.resourceConstructor = NonVirtualRunEvent;
    super.ngOnInit();
  }
}


