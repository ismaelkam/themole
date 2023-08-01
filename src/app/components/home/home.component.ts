import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from '../../providers/CustomValidators';
import { Word } from 'src/app/models/word.model';
import { WordService } from '../../word.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  startForm: FormGroup = this.formBuilder.group({
    n_players: ['5', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(3), Validators.max(99)]],
    n_moles: ['1', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(99)]],
    cat_word: ['2', [Validators.required]],
    custom_word: [''],
  }, {
    validators: [Validation.match_mole('n_players', 'n_moles'), Validation.custom_word_is_valid('cat_word', 'custom_word')]
  });
  loading = false;
  submitted = false;
  word?: string = '';
  closeResult = '';
  deferredPrompt: any;
  showInstallButton = false;

  constructor(
    private formBuilder: FormBuilder,
    private wordService: WordService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    
    window.addEventListener('beforeinstallprompt', (event: any) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
      alert(this.showInstallButton);
    });
   
  };

  get f() { return this.startForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    console.log(this.startForm);
    if (this.startForm.invalid) {
      console.log("invalidad form");
      return;
    }
    if(this.startForm.get('cat_word')?.value==0){
      this.word = this.startForm.get('custom_word')?.value;
      this.set_roles();
      this.router.navigate(['/deal-cards']);
    }else{
      this.loading = true;
      this.wordService.getWord(this.startForm.get('cat_word')?.value)
        .subscribe({
          next: (res: Word) => {
            console.log(res);
            this.submitted = false;
            this.loading = false;
            this.word = res.word;
           this.set_roles();
           this.router.navigate(['/deal-cards']);
          },
          error: (e: any) => {
            console.error(e);
            this.submitted = false;
            this.loading = false;
            this.wordService.getWordFile(this.startForm.get('cat_word')?.value).subscribe({
              next: (data: any) => {
                this.word = data['word'];
                this.set_roles();
                this.router.navigate(['/deal-cards']);
              },
              error: (error: any) => { console.error('Error:', error)}
            });
          }
        });
    }
    
  }


  set_roles() {

    let n_players: number = this.startForm.get('n_players')?.value;
    let n_moles: number = this.startForm.get('n_moles')?.value;
    const palabras = new Array(Number(n_players)).fill(this.word);

    let indicesAleatorios: number[] = [];
    while (indicesAleatorios.length < n_moles) {
      const randomIndex = Math.floor(Math.random() * palabras.length);
    
      if (!indicesAleatorios.includes(randomIndex)) {
        indicesAleatorios.push(randomIndex);
      }
    }
  
    for (const index of indicesAleatorios) {
      palabras[index] = "themole";
    }
    
    this.wordService.players_role = palabras;
    console.log(palabras);
  }

  open(content: any) {
    this.modalService.open(content, {});
  }

  change_input(field:string, action:string){
    let valor: number = Number(this.startForm.get(field)!.value);
    if(action=='minus'){
      if(field=='n_players' && valor>3) this.startForm.get(field)!.setValue(valor-1);
      if(field=='n_moles' && valor>1) this.startForm.get(field)!.setValue(valor-1);
    }else{
      this.startForm.get(field)!.setValue(valor+1);
    }
  }

  installPwa(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario ha instalado la PWA.');
          this.showInstallButton = false;
        } else {
          console.log('El usuario ha rechazado la instalación de la PWA.');
        }
        this.deferredPrompt = null;
      });
    }
  }

}
