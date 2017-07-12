import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import {Database} from '@ngrx/db';
import {Observable} from 'rxjs/Observable';
import {defer} from 'rxjs/observable/defer';
import {of} from 'rxjs/observable/of';

import {CollectionActionEnum} from '../actions/collection';
import {TypedAction} from '../actions/action-enum';
import {Book} from '../models/book';


@Injectable()
export class CollectionEffects {

  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('books_app');
  });

  /**
   * This effect makes use of the `startWith` operator to trigger
   * the effect immediately on startup.
   */
  @Effect()
  loadCollection$: Observable<Action> = this.actions$
    .ofType(CollectionActionEnum.LOAD.type)
    .startWith(CollectionActionEnum.LOAD.toAction())
    .switchMap(() =>
      this.db.query('books')
        .toArray()
        .map((books: Book[]) => CollectionActionEnum.LOAD_SUCCESS.toAction(books))
        .catch(error => of(CollectionActionEnum.LOAD_FAIL.toAction(error)))
    );

  @Effect()
  addBookToCollection$: Observable<Action> = this.actions$
    .ofType(CollectionActionEnum.ADD_BOOK.type)
    .map((action: TypedAction<Book>) => action.payload)
    .mergeMap(book =>
      this.db.insert('books', [ book ])
        .map(() => CollectionActionEnum.ADD_BOOK_SUCCESS.toAction(book))
        .catch(() => of(CollectionActionEnum.ADD_BOOK_FAIL.toAction(book)))
    );


  @Effect()
  removeBookFromCollection$: Observable<Action> = this.actions$
    .ofType(CollectionActionEnum.REMOVE_BOOK.type)
    .map((action: TypedAction<Book>) => action.payload)
    .mergeMap(book =>
      this.db.executeWrite('books', 'delete', [ book.id ])
        .map(() => CollectionActionEnum.REMOVE_BOOK_SUCCESS.toAction(book))
        .catch(() => of(CollectionActionEnum.REMOVE_BOOK_FAIL.toAction(book)))
    );

    constructor(private actions$: Actions, private db: Database) { }
}
