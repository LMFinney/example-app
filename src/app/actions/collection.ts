import {Book} from '../models/book';
import {ActionEnum, ActionEnumValue} from './action-enum';

export class CollectionAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

export class CollectionActionEnumType extends ActionEnum<CollectionAction<any>> {
  /**
   * Add Book to Collection Actions
   */
  ADD_BOOK: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Add Book');
  ADD_BOOK_SUCCESS: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Add Book Success');
  ADD_BOOK_FAIL: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Add Book Fail');
  /**
   * Remove Book from Collection Actions
   */
  REMOVE_BOOK: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Remove Book');
  REMOVE_BOOK_SUCCESS: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Remove Book Success');
  REMOVE_BOOK_FAIL: CollectionAction<Book> =
    new CollectionAction<Book>('[Collection] Remove Book Fail');
  /**
   * Load Collection Actions
   */
  LOAD: CollectionAction<void> =
    new CollectionAction<void>('[Collection] Load');
  LOAD_SUCCESS: CollectionAction<Book[]> =
    new CollectionAction<Book[]>('[Collection] Load Success');
  LOAD_FAIL: CollectionAction<any> =
    new CollectionAction<any>('[Collection] Load Fail');

  constructor() {
    super();
    this.initEnum('collectionActions');
  }
}

export const CollectionActionEnum: CollectionActionEnumType =
  new CollectionActionEnumType();
