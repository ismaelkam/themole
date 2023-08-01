import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map, tap } from 'rxjs/operators';
import { Word } from './models/word.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WordService {
  players_role: string[] = [];
  constructor(private http: HttpClient) { }

  getWord(id_cat: number): Observable<Word> {
    return this.http.get<Word>(`api.php?id_cat=${id_cat}`)
    .pipe(retry(1), catchError(this.handleError));
  }


  getWordFile(id_cat: number): Observable<any>  {

    return this.http.get<any[]>("assets/words.json")
    .pipe(
      map((data: any) => {

      let filtered_word = data.filter(function (item: { category_id: number,word: string }) {
         return item.category_id == id_cat;
      });

      var element_word = filtered_word[Math.floor(Math.random()*filtered_word.length)];
  
      return element_word;
      },
      catchError(this.handleError)
      )
    );  
  }

  resetGame(){
    this.players_role = [];
  }


  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }

}
