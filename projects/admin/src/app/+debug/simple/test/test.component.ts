import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'admin-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent implements OnInit {

  constructor() { 
    console.log('dada',this.dada);
  }

  ttc = 'ttc';

  @Input()
  dada : string

  ngOnInit() {
    // console.log(this.dada);
  }

}
