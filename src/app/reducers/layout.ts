import {LayoutActionEnum} from '../actions/layout';
import {ActionEnumValue, TypedAction} from '../actions/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction
} from './reducer-enum';
import {ActionReducer} from '@ngrx/store';


export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

export class LayoutReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T>, reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

export class LayoutReducerEnumType extends ReducerEnum<LayoutReducer<any>, State> {

  CLOSE_SIDENAV: LayoutReducer<void> =
    new LayoutReducer<void>(LayoutActionEnum.CLOSE_SIDENAV,
      (state: State) => ({showSidenav: false}));
  OPEN_SIDENAV: LayoutReducer<void> =
    new LayoutReducer<void>(LayoutActionEnum.OPEN_SIDENAV,
      (state: State) => ({showSidenav: true}));

  constructor() {
    super(initialState);
    this.initEnum('layoutReducers');
  }
}

export const LayoutReducerEnum: LayoutReducerEnumType = new LayoutReducerEnumType();
const reducer: ActionReducer<State> = LayoutReducerEnum.reducer();

export function layoutReducer(state: State, action: TypedAction<any>): State {
  return reducer(state, action);
}

export const getShowSidenav = (state: State) => state.showSidenav;
