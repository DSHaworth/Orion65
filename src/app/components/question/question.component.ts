import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() q: any;
  selectedOption: string;
  isCorrectAnswer: boolean = false;

  constructor() { }

  onSubmitClick(){
    console.log(this.q);
    console.log(this.selectedOption);

    const selectedOption = parseInt(this.selectedOption);
    
    if(this.q.answers[selectedOption].isCorrect){      
      this.isCorrectAnswer = true;
    } else {
      alert("Incorrect");
      this.isCorrectAnswer = false;
    }    

  }

  ngOnInit(): void {
  }

}
