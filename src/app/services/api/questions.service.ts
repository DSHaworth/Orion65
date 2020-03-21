import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  apiUrl: string = "api/questions/";
  jsonHeader: HttpHeaders;

  constructor(
    private httpClient: HttpClient,
  ) {
    
  }

  public getTests():  Observable<any>{
    return this
            .httpClient
            .get<any>( this.apiUrl + `getTests` );
  }

  public getChapters(testId: number):  Observable<any>{

    let params = new HttpParams();
    params = params.append('testId', testId.toString());

    return this
            .httpClient
            .get<any>( this.apiUrl + `getChapters`, {params: params} );
  }

  public getQuestions():  Observable<any>{

    return this
            .httpClient
            .get<any>( this.apiUrl + `getQuestions` );
  }
}