import { Injectable } from "@angular/core";
import { IPodcast } from "../components/podcasts/podcast";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map, of, switchMap, tap, throwError } from "rxjs";
import { XmlParser } from "@angular/compiler";


@Injectable({
  providedIn: 'root'
})
export class PodcastService
{
  private rssFeed = 'http://localhost:3000/podcasts';
  private updatePodcastsUrl = 'http://localhost:3000/updatepodcast'
  headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

  jsonHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  requestOptions: Object = {
    responseType: 'text'
  }
  podcasts$ = this.http.get<string>(this.rssFeed, this.requestOptions).pipe(
    map(data => JSON.parse(data) as IPodcast[]),
    tap(data => console.log('Podcasts: ', JSON.stringify(data))),
    catchError(this.handleError)
  )
  updatePodcast(podcast: IPodcast): Observable<IPodcast> {
    console.log(podcast);
    return this.http.post<IPodcast>(this.updatePodcastsUrl, podcast, { headers: this.jsonHeaders }).pipe(
      tap(data => console.log('updatePodcast: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );

    }
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
