import * as fromBooks from './books';
import {BooksReducerEnum} from './books';
import {Book} from '../models/book';
import {BookAction, BookActionEnum} from '../actions/book';

describe('BooksReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = BooksReducerEnum.reducer()(undefined, action);
      expect(result).toEqual(fromBooks.initialState);
    });
  });

  describe('SEARCH_COMPLETE & LOAD_SUCCESS', () => {
    function noExistingBooks(actionEnum: BookAction<Book[]>) {
      const book1 = {id: '111'} as Book;
      const book2 = {id: '222'} as Book;
      const createAction = actionEnum.toAction([book1, book2]);

      const expectedResult = {
        ids: ['111', '222'],
        entities: {
          '111': book1,
          '222': book2
        },
        selectedBookId: null,
      } as fromBooks.State;

      const result = BooksReducerEnum.reducer()(fromBooks.initialState, createAction);
      expect(result).toEqual(expectedResult);
    }

    function existingBooks(actionEnum: BookAction<Book[]>) {
      const book1 = {id: '111'} as Book;
      const book2 = {id: '222'} as Book;
      const initialState = {
        ids: ['111', '222'],
        entities: {
          '111': book1,
          '222': book2
        },
        selectedBookId: null,
      } as any;
      // should not replace existing books
      const differentBook2 = {id: '222', foo: 'bar'} as any;
      const book3 = {id: '333'} as Book;
      const createAction = actionEnum.toAction([book3, differentBook2]);

      const expectedResult = {
        ids: ['111', '222', '333'],
        entities: {
          '111': book1,
          '222': book2,
          '333': book3
        },
        selectedBookId: null,
      } as fromBooks.State;

      const result = BooksReducerEnum.reducer()(initialState, createAction);
      expect(result).toEqual(expectedResult);
    }

    it('should add all books in the payload when none exist', () => {
      noExistingBooks(BookActionEnum.SEARCH_COMPLETE);
      noExistingBooks(BookActionEnum.LOAD);
    });

    it('should add only new books when books already exist', () => {
      existingBooks(BookActionEnum.SEARCH_COMPLETE);
      existingBooks(BookActionEnum.LOAD);
    });
  });

  describe('LOAD', () => {
    it('should add a single book, if the book does not exist', () => {
      const book = {id: '888'} as Book;
      const action = BookActionEnum.LOAD.toAction(book);

      const expectedResult = {
        ids: ['888'],
        entities: {
          '888': book
        },
        selectedBookId: null
      } as fromBooks.State;

      const result = BooksReducerEnum.reducer()(fromBooks.initialState, action);
      expect(result).toEqual(expectedResult);
    });

    it('should return the existing state if the book exists', () => {
      const initialState = {
        ids: ['999'],
        entities: {
          '999': {id: '999'}
        }
      } as any;
      const book = {id: '999', foo: 'baz'} as any;
      const action = BookActionEnum.LOAD.toAction(book);

      const result = BooksReducerEnum.reducer()(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('SELECT', () => {
    it('should set the selected book id on the state', () => {
      const action = BookActionEnum.SELECT.toAction('1');

      const result = BooksReducerEnum.reducer()(fromBooks.initialState, action);
      expect(result.selectedBookId).toBe('1');
    });
  });

  describe('Selections', () => {
    const book1 = {id: '111'} as Book;
    const book2 = {id: '222'} as Book;
    const state: fromBooks.State = {
      ids: ['111', '222'],
      entities: {
        '111': book1,
        '222': book2,
      },
      selectedBookId: '111'
    };

    describe('getEntities', () => {
      it('should return entities', () => {
        const result = fromBooks.getEntities(state);
        expect(result).toBe(state.entities);
      });
    });

    describe('getIds', () => {
      it('should return ids', () => {
        const result = fromBooks.getIds(state);
        expect(result).toBe(state.ids);
      });
    });

    describe('getSelectedId', () => {
      it('should return the selected id', () => {
        const result = fromBooks.getSelectedId(state);
        expect(result).toBe('111');
      });
    });

    describe('getSelected', () => {
      it('should return the selected book', () => {
        const result = fromBooks.getSelected(state);
        expect(result).toBe(book1);
      });
    });

    describe('getAll', () => {
      it('should return all books as an array ', () => {
        const result = fromBooks.getAll(state);
        expect(result).toEqual([book1, book2]);
      });
    });

  });
});
