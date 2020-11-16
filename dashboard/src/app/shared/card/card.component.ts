import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input('title') title: string;
  @Input('hasHeader') hasHeader: boolean;
  @Input('cssClass') cssClass: string = "";
  @Input('closable') closable: boolean;
  @Output('close') closeEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  public close(){
  this.closeEvent.emit();
  }

}
