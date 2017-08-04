import {BookActionEnum} from '../actions/book';
import {Book} from '../models/book';
import {ActionEnumValue, TypedAction} from '../actions/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction
} from './reducer-enum';
import {ActionReducer} from '@ngrx/store';


export interface State {
  ids: string[];
  loading: boolean;
  query: string;
}

const initialState: State = {
  ids: [],
  loading: false,
  query: ''
};

export class SearchReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T>, reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

export class SearchReducerEnumType extends ReducerEnum<SearchReducer<any>, State> {

  SEARCH: SearchReducer<string> =
    new SearchReducer<string>(BookActionEnum.SEARCH,
      (state: State, action: TypedAction<string>): State => {
        const query = action.payload;

        if (query === '') {
          return {
            ids: [],
            loading: false,
            query
          };
        }

        return Object.assign({}, state, {
          query,
          loading: true
        });
      });
  SEARCH_COMPLETE: SearchReducer<Book[]> =
    new SearchReducer<Book[]>(BookActionEnum.SEARCH_COMPLETE,
      (state: State, action: TypedAction<Book[]>): State => {
        return {
          ids: action.payload.map((book: Book) => book.id),
          loading: false,
          query: state.query
        };
      });

  constructor() {
    super(initialState);
    this.initEnum('searchReducers');
  }
}

export const SearchReducerEnum: SearchReducerEnumType = new SearchReducerEnumType();
const reducer: ActionReducer<State> = SearchReducerEnum.reducer();

export function searchReducer(state: State, action: TypedAction<any>): State {
  return reducer(state, action);
}

export const getIds = (state: State) => state.ids;

export const getQuery = (state: State) => state.query;

export const getLoading = (state: State) => state.loading;
