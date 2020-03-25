// https://jasonwatmore.com/post/2019/05/02/angular-7-mock-backend-example-for-backendless-development
// https://jasonwatmore.com/post/2018/10/29/angular-7-user-registration-and-login-example-tutorial
// https://stackblitz.com/edit/angular-7-registration-login-example

// General solution for handling errors?
// https://scotch.io/@vigneshsithirai/angular-6-7-http-client-interceptor-with-error-handling

import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import * as data from './data.json';

// array in local storage for registered users
//let users = localStorage.getItem('users') || [];

// {
//   "question": "",
//   "responses": [
//     {"response": "", correct: false},
//     {"response": "", correct: false},
//     {"response": "", correct: true},
//     {"response": "", correct: false},
//   ],
//   "reason": ""
// },


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        let tests = (data  as  any).default;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
              
              // getTests()
              case url.endsWith('api/questions/getTests') && method === 'GET':
                return getTests();

              // getQuestions(testId: number)
              case url.endsWith('api/questions/getQuestions') && method === 'GET':
                const testId = request.params.get("testId");
                return getQuestions(parseInt(testId));
            }
        }

        // route functions
        function getTests(){
          const testNames = tests.map( (test) => {return { id: test.id, name: test.name}; });
          return ok(testNames);
        }

        function getQuestions(testId: number){

          const unit = tests.find( (item) => { return item.id == testId; } )
          const q = unit.questions.map( (q) => { return { question: q.question, answers: q.answers.map( ( ans, index ) => { return { answer: ans, isCorrect: (q.correctAnswerIndex === index) }; }) }; })
          const final = { id: unit.id, name: unit.name, questions: q };
          
          //const unit = tests.find( (item) => { return item.id == testId; } )          
          //return ok(unit);
          return ok(final);
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