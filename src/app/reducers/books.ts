import {createSelector} from 'reselect';
import {Book} from '../models/book';
import {BookActionEnum} from '../actions/book';
import {CollectionActionEnum} from '../actions/collection';
import {ActionEnumValue, TypedAction} from '../actions/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction
} from './reducer-enum';
import {ActionReducer} from '@ngrx/store';


export interface State {
  ids: string[];
  entities: { [id: string]: Book };
  selectedBookId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedBookId: null,
};

export class BooksReducer<T> extends ReducerEnumValue<State, T> {
  constructor(action: ActionEnumValue<T> | ActionEnumValue<T>[],
              reduce: ReducerFunction<State, T>) {
    super(action, reduce);
  }
}

export class BooksReducerEnumType extends ReducerEnum<BooksReducer<any>, State> {

  SEARCH_COMPLETE = new BooksReducer<Book[]>(
      [BookActionEnum.SEARCH_COMPLETE, CollectionActionEnum.LOAD_SUCCESS],
      (state: State, action: TypedAction<Book[]>) => {
        const books = action.payload;
        const newBooks = books.filter((book: Book) => !state.entities[book.id]);

        const newBookIds = newBooks.map((book: Book) => book.id);
        const newBookEntities = newBooks.reduce((entities: { [id: string]: Book }, book: Book) => {
          return Object.assign(entities, {
            [book.id]: book
          });
        }, {});

        return {
          ids: [...state.ids, ...newBookIds],
          entities: Object.assign({}, state.entities, newBookEntities),
          selectedBookId: state.selectedBookId
        };
      });
  LOAD = new BooksReducer<Book>(BookActionEnum.LOAD,
      (state: State, action: TypedAction<Book>) => {
        const book = action.payload;

        if (state.ids.indexOf(book.id) > -1) {
          return state;
        }

        return {
          ids: [...state.ids, book.id],
          entities: Object.assign({}, state.entities, {
            [book.id]: book
          }),
          selectedBookId: state.selectedBookId
        };
      });
  SELECT = new BooksReducer<string>(BookActionEnum.SELECT,
      (state: State, action: TypedAction<string>) => {
        return {
          ids: state.ids,
          entities: state.entities,
          selectedBookId: action.payload
        };
      });

  constructor() {
    super(initialState);
    this.initEnum('booksReducers');
  }
}

export const BooksReducerEnum = new BooksReducerEnumType();
const reducer: ActionReducer<State> = BooksReducerEnum.reducer();

export function booksReducer(state: State, action: TypedAction<any>): State {
  return reducer(state, action);
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedBookId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
