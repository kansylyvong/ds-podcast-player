import { Injectable } from "@angular/core";
import { IPodcast } from "./podcast";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map, of, switchMap, tap, throwError } from "rxjs";
import { XmlParser } from "@angular/compiler";


@Injectable({
  providedIn: 'root'
})
export class PodcastService
{
  private rssFeed = 'http://localhost:3000/podcasts';
  headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  requestOptions: Object = {
    responseType: 'text'
  }
  podcasts$ = this.http.get<string>(this.rssFeed, this.requestOptions).pipe(
    map(data => JSON.parse(data) as IPodcast[]),
    tap(data => console.log('Podcasts: ', JSON.stringify(data))),
    catchError(this.handleError)
  )
  constructor(private http: HttpClient) {

  }



  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
