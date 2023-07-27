import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from './models/word.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private http: HttpClient) { }

  getWord(id_cat: number): Observable<Word> {
    return this.http.get<Word>(`api.php?id_cat=${id_cat}`);
  }

}
