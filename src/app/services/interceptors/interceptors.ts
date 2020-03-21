// https://medium.com/@swapnil.s.pakolu/angular-interceptors-multiple-interceptors-and-6-code-examples-of-interceptors-59e745b684ec

import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { FakeBackendInterceptor } from './fake-backend-interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const interceptorProviders = 
   [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
];