import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input('title') title: string;
  @Input('hasHeader') hasHeader: boolean;
  @Input('cssClass') cssClass: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
