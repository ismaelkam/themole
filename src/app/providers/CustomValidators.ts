import { AbstractControl, ValidatorFn } from '@angular/forms';
export default class Validation {
  static match_mole(n_players: string, n_moles: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const n_playersControl = controls.get(n_players);
      const n_molesControl = controls.get(n_moles);
      //console.log("n_players:" + n_playersControl?.value);
      //console.log("n_moles:" + n_molesControl?.value);
      if (n_molesControl?.errors && !n_molesControl.errors['match_mole']) {
        return null;
      }

      if (n_playersControl?.value == '' || n_molesControl?.value == '') {
        return null;
      }
      if (n_playersControl?.value < n_molesControl?.value) {
        n_molesControl?.setErrors({ match_mole: true });
        console.log("Marco error 1");
        return { match_mole: true, 'ejemplo1': 10 };
      } else {
        return null;
      }
    };
  }

  static custom_word_is_valid(cat_word: string, custom_word: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const cat_wordControl = controls.get(cat_word);
      const custom_wordControl = controls.get(custom_word);
      console.log(cat_wordControl);
      console.log(custom_wordControl);
      /*if (n_playersControl?.errors && !n_molesControl.errors['matching']) {
        return null;
      }*/
     // console.log("Marco error 2a" + cat_wordControl?.value);
      if (cat_wordControl?.value == 0 && custom_wordControl?.value == '') {
        custom_wordControl?.setErrors({ custom_word_error: true });
        return { custom_word_error: true };
      } else {
        custom_wordControl?.setErrors(null);
        return null;
      }
    };
  }

  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }
      if (control?.value !== checkControl?.value) {
        checkControl?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

}