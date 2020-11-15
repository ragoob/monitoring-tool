import { NavItem } from '../models/nav-menu.model';
export const MENU_HOME:NavItem = {
  displayName: 'Home',
  iconName: 'home',
  route : '/',
}
export const MENU_MANAGEMENT: NavItem[] = [
  {
    displayName: 'Management',
    iconName: 'admin_panel_settings',
    route : undefined,
    children: [{
      displayName : 'Users',
      iconName : '',
      route : `/management/users`
    }]
  }
]