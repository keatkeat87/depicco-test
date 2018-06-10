import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonVirtualRunEventService, NonVirtualRunEvent } from '../../../entities/Resource';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';
import { EventComponent } from '../event.component';
import { AbstractSimplePutFormComponent } from '../../../cp/simple-form/abstract-simple-put-form.component';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class NonVirtualRunEventPutFormComponent extends AbstractSimplePutFormComponent<NonVirtualRunEvent> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    nonVirtualRunEventService: NonVirtualRunEventService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    eventComponent: EventComponent
  ) {
    super(cdr, nonVirtualRunEventService, activatedRoute, router, edmFormService, eventComponent as any);
  }

  async ngOnInit() {
    this.displayKeys = [
      'image', 'title', 'urlTitle', 'registerDeadline', 'startRunDate', 
      'endRunDate', 'registerAmount', 'participant', 'summary', 'description',
      'googleFormLink', 'location', 'startRunTime', 'endRunTime'
    ];
    super.ngOnInit();
  }

}



