import {CollectionActionEnum} from '../actions/collection';
import {Book} from '../models/book';
import {ActionEnumValue, TypedAction} from '../actions/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction
} from './reducer-enum';
import {ActionReducer} from '@ngrx/store';


export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export class CollectionReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T> | ActionEnumValue<T>[],
              reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

export class CollectionReducerEnumType extends ReducerEnum<CollectionReducer<any>, State> {

  LOAD = new CollectionReducer<void>(CollectionActionEnum.LOAD,
      (state: State) => ({...state, loading: true}));
  LOAD_SUCCESS = new CollectionReducer<Book[]>(CollectionActionEnum.LOAD_SUCCESS,
      (state: State, action: TypedAction<Book[]>) => {
        return {
          loaded: true,
          loading: false,
          ids: action.payload.map((book: Book) => book.id)
        };
      });
  ADD_BOOK_SUCCESS = new CollectionReducer<Book>(
      [CollectionActionEnum.ADD_BOOK_SUCCESS,
        CollectionActionEnum.REMOVE_BOOK_FAIL],
      (state: State, action: TypedAction<Book>) => {
        const book = action.payload;

        if (state.ids.indexOf(book.id) > -1) {
          return state;
        }

        return Object.assign({}, state, {
          ids: [ ...state.ids, book.id ]
        });
      });
  REMOVE_BOOK_SUCCESS = new CollectionReducer<Book>(
      [CollectionActionEnum.REMOVE_BOOK_SUCCESS,
        CollectionActionEnum.ADD_BOOK_FAIL],
      (state: State, action: TypedAction<Book>) => {
        const book = action.payload;

        return Object.assign({}, state, {
          ids: state.ids.filter(id => id !== book.id)
        });
      });

  constructor() {
    super(initialState);
    this.initEnum('collectionReducers');
  }
}

export const CollectionReducerEnum = new CollectionReducerEnumType();
const reducer: ActionReducer<State> = CollectionReducerEnum.reducer();

export function collectionReducer(state: State, action: TypedAction<any>): State {
  return reducer(state, action);
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
