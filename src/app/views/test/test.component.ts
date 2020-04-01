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
  public selectedTestId: number;
  public selectedTest: any;
  public shuffledQuestions: any;
  public numberOfQuestions: number = 100;
  public grade: string = "";
  
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;

  constructor(
    private questionsService: QuestionsService,
    private snackbarService: SnackbarService,
    private loggingService: LoggingService
  ) { }

  onTestChange(event){
    //this.loggingService.log(event);
    this.selectedTestId = event.value;
    this.getQuestions();
  }

  onRefreshClicked(){

    this.getQuestions();

    // //this.shuffleQuestions();
    // this.shuffledQuestions.length = 0;
    // this.shuffledQuestions = null;
    // this.shuffleQuestions();
  }

  responseEvent(event){
    if(event){
      this.correctAnswers += 1;
    } else {
      this.incorrectAnswers += 1;
    }

    if(this.correctAnswers + this.incorrectAnswers === this.shuffledQuestions.length){
      this.grade = `${(this.correctAnswers / this.shuffledQuestions.length) * 100}%`;
    }

  }

  shuffleQuestions(){

    this.correctAnswers = 0;
    this.incorrectAnswers = 0;  
    this.grade = "";
    
    // Shuffle Questions
    let questions = this.shuffle(this.selectedTest.questions.slice());

    // Shuffle Answers
    for(let idx = 0, max = questions.length ; idx < max ; idx++){
      questions[idx].answers = this.shuffle(questions[idx].answers);
    }

    this.shuffledQuestions = questions.slice(0, 0);
    this.shuffledQuestions = questions.slice(0, this.numberOfQuestions);
  }

  getQuestions(){
    this.isBusy = true;

    this.loggingService.log(this.selectedTestId);

    this.questionsService.getQuestions(this.selectedTestId)
      .subscribe( 
        result => {          
          this.loggingService.log(result);
          this.selectedTest = result;

          this.shuffleQuestions();
        },
        error => {
          this.snackbarService.showError(error);
          this.loggingService.log(error);
        }
      ).add(() => {
        this.isBusy = false;
      });    
  }

  getTests(){
    this.isBusy = true;
    this.questionsService.getTests()
      .subscribe( 
        result => {          
          //this.loggingService.log(result);
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

  shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
    }
    return arra1;
  }

  ngOnInit(): void {
    this.getTests();
  }

}
