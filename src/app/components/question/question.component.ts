import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() question: any;
  @Input() index: string;
  selectedOption: string;
  classname: string;

  constructor() { }

  onSubmitClick(){
    console.log(this.question);
    console.log(this.selectedOption);
    
    const selectedOption = parseInt(this.selectedOption);
    let correctIndex: number;
    
    const responses = document.getElementsByClassName(this.classname);

    for(var idx = 0, max = responses.length ; idx < max ; idx++){
      responses[idx].classList.remove("correctAnswer");
      responses[idx].classList.remove("incorrectAnswer");

      if(this.question.answers[idx].isCorrect){
        correctIndex = idx;
      }
    }    

    if(this.question.answers[selectedOption].isCorrect){
      responses[selectedOption].classList.add("correctAnswer");
    } else {
      responses[correctIndex].classList.add("correctAnswer");
      responses[selectedOption].classList.add("incorrectAnswer");
    }    

  }

  ngOnInit(): void {
    this.classname = "response" + this.index;
  }

}
