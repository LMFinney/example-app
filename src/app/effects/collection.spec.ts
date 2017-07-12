import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import {Action} from '@ngrx/store';
import {EffectsRunner, EffectsTestingModule} from '@ngrx/effects/testing';
import {TestBed} from '@angular/core/testing';
import {CollectionEffects} from './collection';
import {Database} from '@ngrx/db';
import {Book} from '../models/book';
import {CollectionActionEnum} from '../actions/collection';
import {Observable} from 'rxjs/Observable';

describe('CollectionEffects', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      CollectionEffects,
      {
        provide: Database,
        useValue: jasmine.createSpyObj('database', ['open', 'query', 'insert', 'executeWrite'])
      }
    ]
  }));

  function setup() {
    return {
      db: TestBed.get(Database),
      runner: TestBed.get(EffectsRunner),
      collectionEffects: TestBed.get(CollectionEffects)
    };
  }

  describe('openDB$', () => {
    it('should call db.open when initially subscribed to', () => {
      const {db, collectionEffects} = setup();
      collectionEffects.openDB$.subscribe();
      expect(db.open).toHaveBeenCalledWith('books_app');
    });
  });

  describe('loadCollection$', () => {
    it('should return a collection.LoadSuccessAction, with the books, on success', () => {
      const book1 = {id: '111', volumeInfo: {}} as Book;
      const book2 = {id: '222', volumeInfo: {}} as Book;

      const {db, runner, collectionEffects} = setup();

      const booksObservable = Observable.of(book1, book2);
      db.query.and.returnValue(booksObservable);

      const expectedResult = CollectionActionEnum.LOAD_SUCCESS.toAction([book1, book2]);

      runner.queue(CollectionActionEnum.LOAD.toAction());

      collectionEffects.loadCollection$.subscribe((result: Action) => {
        expect(result).toEqual(expectedResult);
      });
    });

    it('should return a collection.LoadFailAction, if the query throws', () => {
      const {db, runner, collectionEffects} = setup();

      const error = new Error('msg');
      db.query.and.returnValue(Observable.throw(error));

      const expectedResult = CollectionActionEnum.LOAD_FAIL.toAction(error);

      runner.queue(CollectionActionEnum.LOAD.toAction());

      collectionEffects.loadCollection$.subscribe((result: Action) => {
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('addBookToCollection$', () => {
    it('should return a collection.AddBookSuccessAction, with the book, on success', () => {
      const book = {id: '111', volumeInfo: {}} as Book;

      const {db, runner, collectionEffects} = setup();
      db.insert.and.returnValue(Observable.of({}));

      const expectedResult = CollectionActionEnum.ADD_BOOK_SUCCESS.toAction(book);

      runner.queue(CollectionActionEnum.ADD_BOOK.toAction(book));

      collectionEffects.addBookToCollection$.subscribe((result: Action) => {
        expect(result).toEqual(expectedResult);
        expect(db.insert).toHaveBeenCalledWith('books', [book]);
      });
    });

    it('should return a collection.AddBookFailAction, with the book, when the db insert throws', () => {
      const book = {id: '111', volumeInfo: {}} as Book;

      const {db, runner, collectionEffects} = setup();
      db.insert.and.returnValue(Observable.throw(new Error()));

      const expectedResult = CollectionActionEnum.ADD_BOOK_FAIL.toAction(book);

      runner.queue(CollectionActionEnum.ADD_BOOK.toAction(book));

      collectionEffects.addBookToCollection$.subscribe((result: Action) => {
        expect(result).toEqual(expectedResult);
        expect(db.insert).toHaveBeenCalledWith('books', [book]);
      });
    });

    describe('removeBookFromCollection$', () => {
      it('should return a collection.RemoveBookSuccessAction, with the book, on success', () => {
        const book = {id: '111', volumeInfo: {}} as Book;

        const {db, runner, collectionEffects} = setup();
        db.executeWrite.and.returnValue(Observable.of({}));

        const expectedResult = CollectionActionEnum.REMOVE_BOOK_SUCCESS.toAction(book);

        runner.queue(CollectionActionEnum.REMOVE_BOOK.toAction(book));

        collectionEffects.removeBookFromCollection$.subscribe((result: Action) => {
          expect(result).toEqual(expectedResult);
          expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', ['111']);
        });
      });

      it('should return a collection.RemoveBookFailAction, with the book, when the db insert throws', () => {
        const book = {id: '111', volumeInfo: {}} as Book;

        const {db, runner, collectionEffects} = setup();
        db.executeWrite.and.returnValue(Observable.throw(new Error()));

        const expectedResult = CollectionActionEnum.REMOVE_BOOK_FAIL.toAction(book);

        runner.queue(CollectionActionEnum.REMOVE_BOOK.toAction(book));

        collectionEffects.removeBookFromCollection$.subscribe((result: Action) => {
          expect(result).toEqual(expectedResult);
          expect(db.executeWrite).toHaveBeenCalledWith('books', 'delete', ['111']);
        });
      });
    });
  });
});
