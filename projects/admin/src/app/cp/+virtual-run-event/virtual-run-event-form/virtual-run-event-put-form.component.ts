import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VirtualRunEventService, VirtualRunEvent } from '../../../entities/Resource';
import { VirtualRunEventComponent } from '../virtual-run-event.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class VirtualRunEventPutFormComponent extends AbstractSimplePutFormComponent<VirtualRunEvent> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    virtualRunEventService: VirtualRunEventService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    virtualRunEventComponent: VirtualRunEventComponent
  ) {
    super(cdr, virtualRunEventService, activatedRoute, router, edmFormService, virtualRunEventComponent);
  }

  async ngOnInit() {
    this.displayKeys = [
      'image', 'title', 'urlTitle', 'registerDeadline', 'startRunDate', 
      'endRunDate', 'registerAmount', 'participant', 'summary', 'description',
      'googleFormLink', 'group'
    ];
    super.ngOnInit();
  }

}



