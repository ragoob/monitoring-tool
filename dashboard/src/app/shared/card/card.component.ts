import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';


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
  @Input('hasActions') hasActions: boolean;
  @Output('close') closeEvent: EventEmitter<any> = new EventEmitter<any>();
  @ContentChild('actionTemplate',{static: true}) actionTemplate: TemplateRef<any>; 
  constructor(){}

  ngOnInit(): void {
    
  }

  public close(){
  this.closeEvent.emit();
  }

}
