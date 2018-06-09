import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'admin-select-languages',
  templateUrl: './select-languages.component.html',
  styleUrls: ['./select-languages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatCPSelectLanguagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
