import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavItem } from '../../core/models/nav-menu.model';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit, OnDestroy {
  public expanded: boolean = false;
  public isActive: boolean = false;
  private subscribers: Subscription[] = [];
  @HostBinding('attr.aria-expanded') ariaExpanded: boolean = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public router: Router) { }

  ngOnDestroy(): void {
    this.subscribers.forEach(s => s.unsubscribe());
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }

    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }


  public ngOnInit(): void {
    this.subscribers.push(
      this.router.events.subscribe(m => {
        this.activateItem();
    })
    )
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.activateItem();
  }

  private activateItem() : void{
    if (this.item.children && this.item.children.length > 0) {
      const hasActiveItem: boolean = this.item.children.findIndex(c => this.router.isActive(c.route, true)) > -1;
      this.expanded = hasActiveItem;
      this.isActive = hasActiveItem;
    }
  }

}
