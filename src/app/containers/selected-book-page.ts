import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import * as fromRoot from '../reducers';
import {CollectionActionEnum} from '../actions/collection';
import {Book} from '../models/book';


@Component({
  selector: 'bc-selected-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-book-detail
      [book]="book$ | async"
      [inCollection]="isSelectedBookInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-book-detail>
  `
})
export class SelectedBookPageComponent {
  book$: Observable<Book>;
  isSelectedBookInCollection$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.book$ = store.select(fromRoot.getSelectedBook);
    this.isSelectedBookInCollection$ = store.select(fromRoot.isSelectedBookInCollection);
  }

  addToCollection(book: Book) {
    this.store.dispatch(CollectionActionEnum.ADD_BOOK.toAction(book));
  }

  removeFromCollection(book: Book) {
    this.store.dispatch(CollectionActionEnum.REMOVE_BOOK.toAction(book));
  }
}
