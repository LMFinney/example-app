import {Book} from '../models/book';
import {ActionEnum, ActionEnumValue} from './action-enum';

export class BookAction<T> extends ActionEnumValue<T> {
  constructor(name: string) {
    super(name);
  }
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions. Enums simplify generating
 * the classes.
 */
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

