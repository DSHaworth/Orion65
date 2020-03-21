// https://jasonwatmore.com/post/2019/05/02/angular-7-mock-backend-example-for-backendless-development
// https://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial
// https://stackblitz.com/edit/angular-7-registration-login-example

// General solution for handling errors?
// https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let tests = [
  { "id": 1, "name": "Test 1", "chapters": [
    { "id": 1, "name": "Chapter 1", "questions": []},
    { "id": 2, "name": "Chapter 2", "questions": []}
  ]},
  { "id": 2, "name": "Test 2", "chapters": [
    { "id": 3, "name": "Chapter 3", "questions": []},
    { "id": 4, "name": "Chapter 4", "questions": []}
  ]},
  { "id": 3, "name": "Test 3", "chapters": [
    { "id": 5, "name": "Chapter 5", "questions": []},
    { "id": 6, "name": "Chapter 6", "questions": []},
    { "id": 7, "name": "Chapter 7", "questions": []},
    { "id": 8, "name": "Chapter 8", "questions": []},
    { "id": 9, "name": "Chapter 9", "questions": []},
  ]},
  { "id": 4, "name": "Test 4", "chapters": [
    { "id": 10, "name": "Chapter 10", "questions": []},
    { "id": 11, "name": "Chapter 11", "questions": []},
    { "id": 12, "name": "Chapter 12", "questions": []},
    { "id": 13, "name": "Chapter 13", "questions": []}
  ]},
  { "id": 5, "name": "Test 5", "chapters": [
    { "id": 14, "name": "Chapter 14", "questions": []},
    { "id": 15, "name": "Chapter 15", "questions": []},
    { "id": 16, "name": "Chapter 16", "questions": []},    
    { "id": 17, "name": "Chapter 17", "questions": []}
  ]},
  { "id": 6, "name": "Test 6", "chapters": [
    { "id": 18, "name": "Chapter 18", "questions": []},
    { "id": 19, "name": "Chapter 19", "questions": []},
    { "id": 20, "name": "Chapter 20", "questions": []}
  ]}
];

// array in local storage for registered users
//let users = localStorage.getItem('users') || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
              case url.endsWith('api/questions/getTests') && method === 'GET':
                return getTests();

              case url.endsWith('api/questions/getChapters') && method === 'GET':
                console.log("handleRoute");
                console.log(request.params.get("testId"));
                const testId = request.params.get("testId");

                return getChapters(parseInt(testId));

              case url.endsWith('api/questions/getQuestions') && method === 'GET':
                return getQuestions();

            }
        }

        // route functions
        function getTests(){
          
          const testNames = tests.map( (test) => {return { id: test.id, name: test.name}; });
          return ok(testNames);

        }

        function getChapters(testId: number){
          const chapters = tests.find( (item) => { return item.id == testId; } )
          const chapterNames = chapters.chapters.map( (chapter) => { return {id: chapter.id, name: chapter.name}; })
          return ok(chapterNames);
        }

        function getQuestions(){
          return ok(tests);
        }

        ///////////////////
        // helper functions
        ///////////////////
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};