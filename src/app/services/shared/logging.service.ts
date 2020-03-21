import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(valueToLog: any){
    if(typeof(valueToLog) === "object"){
      console.dir(valueToLog);
    } else {
      console.log(valueToLog);
    }    
  }
}
