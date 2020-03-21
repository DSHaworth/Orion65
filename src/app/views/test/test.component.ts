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
  public chapters: any[];
  public selectedTest: string;
  public selectedChapters: string[];

  constructor(
    private questionsService: QuestionsService,
    private snackbarService: SnackbarService,
    private loggingService: LoggingService
  ) { }

  onTestChange(event){
    //this.loggingService.log(event);
    this.getChapters(event.value);
  }

  getChapters(testId: number){
    this.isBusy = true;
    this.questionsService.getChapters(testId)
      .subscribe( 
        result => {          
          //this.snackbarService.showSuccess("It worked");
          this.loggingService.log(result);
          this.chapters = result;          
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
          //this.snackbarService.showSuccess("It worked");
          //this.loggingService.log(result);
          this.tests = result;          
        },
        error => {
          this.snackbarService.showError(error);
          this.loggingService.log(error);
        }
      ).add(() => {
        this.isBusy = false;
        //this.loggingService.log("DONE");
      });    
  }

  ngOnInit(): void {
    this.getTests();
  }

}
