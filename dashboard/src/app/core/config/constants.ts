import { Menu } from "../models/menu.model";

export const MENU_CONFIG = {
    paddingAtStart: true,
    classname: 'my-custom-class',
    listBackgroundColor: '#2a3042',
    fontColor: '#a6b0cf',
    backgroundColor: '#2a3042',
    selectedListFontColor: '#fff',
    useDividers: false,
  };

export const MENU_HOME:Menu = {
  label: 'Home',
  faIcon: '',
  link : '/',
}
export const MENU_MANAGEMENT: Menu[] = [
  {
    label: 'Management',
    faIcon: '',
    link : undefined,
    items: [{
      label : 'Users',
      faIcon : '',
      link : `/management/users`
    }]
  }
]