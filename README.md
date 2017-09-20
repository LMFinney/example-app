# @ngrx example application, using enums

[@ngrx/store](https://github.com/ngrx/store) is a very powerful utility for managing
the state of Angular apps, but some developers have criticized the [example app](https://github.com/ngrx/example-app)
for containing too much boilerplate (particularly in the action classes) and for having
large switch statements in the reducers. This is a fork of the [example app](https://github.com/ngrx/example-app)
that uses [ts-enums](https://github.com/LMFinney/ts-enums) to encapsulate the actions and 
reducers, thereby reducing boilerplate and hiding the switch statement from view.

Built with [@angular/cli](https://github.com/angular/angular-cli).

If you want to use the base action and reducer enums, you can get them from 
[ngrx-enums](https://github.com/LMFinney/ngrx-enums), where they have been 
extracted from this project with slight modifications.

### Details
Because the actions are used throughout the app, there are changes from the original example
in many files. However, the most important changes are in the [actions](src/app/actions) and
[reducers](src/app/reducers).

#### Action Example
Although the enum approach adds some enum-related boilerplate, it reduces the code greatly 
overall by removing the action-related boilerplate. This is possible due to moving repeated 
logic into [action-enum.ts](src/app/actions/action-enum.ts).

[Before](https://github.com/ngrx/example-app/blob/d7547f282cd3f22a1ec9e03f07e27365d5242bdb/src/app/actions/book.ts):
```typescript
import { Action } from '@ngrx/store';
import { Book } from '../models/book';

export const SEARCH =           '[Book] Search';
export const SEARCH_COMPLETE =  '[Book] Search Complete';
export const LOAD =             '[Book] Load';
export const SELECT =           '[Book] Select';


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: string) { }
}

export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: Book[]) { }
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: Book) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = SearchAction
  | SearchCompleteAction
  | LoadAction
  | SelectAction;
```

[After](src/app/actions/book.ts):
```typescript
import {Book} from '../models/book';
import {ActionEnum, ActionEnumValue} from './action-enum';

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions. Enums simplify generating
 * the classes.
 */
export class BookAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

export class BookActionEnumType extends ActionEnum<BookAction<any>> {

  SEARCH = new BookAction<string>('[Book] Search');
  SEARCH_COMPLETE = new BookAction<Book[]>('[Book] Search Complete');
  LOAD = new BookAction<Book>('[Book] Load');
  SELECT = new BookAction<string>('[Book] Select');

  constructor() {
    super();
    this.initEnum('bookActions');
  }
}

export const BookActionEnum = new BookActionEnumType();
```

#### Reducer Example
The enum approach eliminates the big switch statement by storing the action instances in 
[reducer-enum.ts](src/app/reducers/reducer-enum.ts).

[Before](https://github.com/ngrx/example-app/blob/d7547f282cd3f22a1ec9e03f07e27365d5242bdb/src/app/reducers/collection.ts):
```typescript
import * as collection from '../actions/collection';


export interface State {
  loaded: boolean;
  loading: boolean;
  ids: string[];
};

const initialState: State = {
  loaded: false,
  loading: false,
  ids: []
};

export function reducer(state = initialState, action: collection.Actions): State {
  switch (action.type) {
    case collection.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case collection.LOAD_SUCCESS: {
      const books = action.payload;

      return {
        loaded: true,
        loading: false,
        ids: books.map(book => book.id)
      };
    }

    case collection.ADD_BOOK_SUCCESS:
    case collection.REMOVE_BOOK_FAIL: {
      const book = action.payload;

      if (state.ids.indexOf(book.id) > -1) {
        return state;
      }

      return Object.assign({}, state, {
        ids: [ ...state.ids, book.id ]
      });
    }

    case collection.REMOVE_BOOK_SUCCESS:
    case collection.ADD_BOOK_FAIL: {
      const book = action.payload;

      return Object.assign({}, state, {
        ids: state.ids.filter(id => id !== book.id)
      });
    }

    default: {
      return state;
    }
  }
}


export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
```

[After](src/app/reducers/collection.ts):
```typescript
import {CollectionActionEnum} from '../actions/collection';
import {Book} from '../models/book';
import {ActionEnumValue, TypedAction} from '../actions/action-enum';
import {
  ReducerEnum,
  ReducerEnumValue,
  ReducerFunction
} from './reducer-enum';


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

  LOAD: CollectionReducer<void> =
    new CollectionReducer<void>(CollectionActionEnum.LOAD,
      (state: State) => ({...state, loading: true}));
  LOAD_SUCCESS: CollectionReducer<Book[]> =
    new CollectionReducer<Book[]>(CollectionActionEnum.LOAD_SUCCESS,
      (state: State, action: TypedAction<Book[]>) => {
        return {
          loaded: true,
          loading: false,
          ids: action.payload.map((book: Book) => book.id)
        };
      });
  ADD_BOOK_SUCCESS: CollectionReducer<Book> =
    new CollectionReducer<Book>(
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
  REMOVE_BOOK_SUCCESS: CollectionReducer<Book> =
    new CollectionReducer<Book>(
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

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;
```

### Quick start

```bash
# clone the repo
git clone https://github.com/LMFinney/ngrx-example-app-enums.git


# change directory to repo
cd ngrx-example-app-enums

# Use npm or yarn to install the dependencies:
npm install

# OR
yarn

# start the server
ng serve
```

Navigate to [http://localhost:4200/](http://localhost:4200/) in your browser

_NOTE:_ The above setup instructions assume you have added local npm bin folders to your path.
If this is not the case you will need to install the Angular CLI globally.
