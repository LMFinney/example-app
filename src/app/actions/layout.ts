import {ActionEnum, ActionEnumValue} from './action-enum';

export class LayoutAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

export class LayoutActionEnumType extends ActionEnum<LayoutAction<any>> {

  OPEN_SIDENAV = new LayoutAction<void>('[Layout] Open Sidenav');
  CLOSE_SIDENAV = new LayoutAction<void>('[Layout] Close Sidenav');

  constructor() {
    super();
    this.initEnum('layoutActions');
  }
}

export const LayoutActionEnum = new LayoutActionEnumType();
