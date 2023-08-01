import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordService } from 'src/app/word.service';

@Component({
  selector: 'app-deal-cards',
  templateUrl: './deal-cards.component.html',
  styleUrls: ['./deal-cards.component.scss']
})
export class DealCardsComponent implements OnInit{
  currentStep: number = 0;
  loading: boolean = false;
  word: string = '';
  palabras = this.wordService.players_role;

  constructor(
    private wordService: WordService,
    private router: Router
  ) { }

  ngOnInit() {
    
    if(this.palabras.length<3){
      this.router.navigate(['/']);
    }
    console.log(this.palabras);

   this.word = this.palabras[this.currentStep];
  };

  nextStep(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.currentStep+= 1;
      this.word = this.palabras[this.currentStep];
      if(this.currentStep==this.palabras.length) this.router.navigate(['/spinner']);
    }, 1000);
    
   
    
  }

  resetGame(){
    this.wordService.resetGame();
    this.router.navigate(['/']);
  }

  get players_role() { return this.wordService.players_role; }


}
