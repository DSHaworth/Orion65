import { Component, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/api/questions.service';
import { SnackbarService } from 'src/app/services/ui/snackbar.service';
import { LoggingService } from 'src/app/services/shared/logging.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  private isBusy: boolean = false;
  public tests: any[];
  public selectedTest: any;
  
  constructor(
    private questionsService: QuestionsService,
    private snackbarService: SnackbarService,
    private loggingService: LoggingService
  ) { }

  onTestChange(event){
    this.loggingService.log(event);
    this.getQuestions(event.value);
  }

  getQuestions(testId: number){
    this.isBusy = true;

    this.loggingService.log(testId);

    this.questionsService.getQuestions(testId)
      .subscribe( 
        result => {          
          this.loggingService.log(result);
          this.selectedTest = result;          
        },
        error => {
          this.snackbarService.showError(error);
          this.loggingService.log(error);
        }
      ).add(() => {
        this.isBusy = false;
        this.loggingService.log("DONE");
      });    
  }

  getTests(){
    this.isBusy = true;
    this.questionsService.getTests()
      .subscribe( 
        result => {          
          this.loggingService.log(result);
          this.tests = result;          
        },
        error => {
          this.snackbarService.showError(error);
          this.loggingService.log(error);
        }
      ).add(() => {
        this.isBusy = false;
      });    
  }

  ngOnInit(): void {
    this.getTests();
  }

}
