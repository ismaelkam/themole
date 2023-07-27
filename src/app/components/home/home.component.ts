import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Validation from '../../providers/CustomValidators';
import { Word } from 'src/app/models/word.model';
import { WordService } from '../../word.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  startForm: FormGroup = this.formBuilder.group({
    n_players: ['5', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(3), Validators.max(99)]],
    n_moles: ['4', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(1), Validators.max(99)]],
    cat_word: ['2', [Validators.required]],
    custom_word: [''],
  }, {
    validators: [Validation.match_mole('n_players', 'n_moles'), Validation.custom_word_is_valid('cat_word', 'custom_word')]
  });
  loading = false;
  submitted = false;
  closeResult = '';

  constructor(
    private formBuilder: FormBuilder,
    private wordService: WordService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  };

  get f() { return this.startForm.controls; }


  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    console.log(this.startForm);
    if (this.startForm.invalid) {
      return;
    }

    this.loading = true;
    this.wordService.getWord(1)
      .subscribe({
        next: (res: Word) => {
          console.log(res);
          this.submitted = true;
          this.loading = false;
        },
        error: (e: any) => {
          alert("hay un error");
          console.error(e)
          this.loading = false;

        }
      });
  }

  open(content: any) {
    this.modalService.open(content, {});
  }

}
