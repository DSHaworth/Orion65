import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() question: any;
  @Input() index: string;
  @Output() responseEvent = new EventEmitter<boolean>();

  answerSubmited: boolean = false;
  selectedOption: string;
  classname: string;

  constructor() { }

  onSubmitClick(){
    //console.log(this.question);
    //console.log(this.selectedOption);

    this.answerSubmited = true;
    
    const selectedOption = parseInt(this.selectedOption);
    let responses = document.getElementsByClassName(this.classname);
    let correctIndex:number = this.question.answers.findIndex( (item)=>{ return item.isCorrect});

    this.selectedOption = null;

    // console.log("correctIndex");
    // console.log(correctIndex);

    // console.log("question");
    // console.log(this.question);

    for(var idx = 0, max = responses.length ; idx < max ; idx++){
      responses[idx].classList.remove("correctAnswer");
      responses[idx].classList.remove("incorrectAnswer");

      console.log("this.question.answers[idx]");
      console.log(this.question.answers[idx])
    }    
    
    if(this.question.answers[selectedOption].isCorrect){
      responses[selectedOption].classList.add("correctAnswer");
      this.responseEvent.emit(true);
    } else {
      responses[correctIndex].classList.add("correctAnswer");
      responses[selectedOption].classList.add("incorrectAnswer");
      this.responseEvent.emit(false);
    }
  }

  ngOnInit(): void {
    this.classname = "response" + this.index;
  }

}
