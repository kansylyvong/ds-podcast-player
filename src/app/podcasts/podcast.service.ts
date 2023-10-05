import { Injectable } from "@angular/core";
import { IPodcast } from "./podcast";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, of, switchMap, tap, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PodcastService
{
  private podcastUrl = 'api/podcasts/podcasts.json';
  private rssFeed = 'api/podcasts/dreaming_spanish.rss';

  podcasts$ = this.http.get(this.rssFeed, { responseType: "text" }).pipe(
    switchMap( xml =>  this.parseXmlToJson(xml)),
    catchError (err => {
      console.error(err)
      throw new Error("Could not retrieve podcasts")
    })
  )
  constructor(private http: HttpClient) {

  }
  getPodcasts(): Observable<IPodcast[]> {
    return this.http.get<IPodcast[]>(this.podcastUrl).pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    )
  }

  getRSSFeed() : Observable<any> {
    return this.http.get(this.rssFeed, { responseType: "text" }).pipe(
      switchMap( xml =>  this.parseXmlToJson(xml)),
      catchError (err => {
        console.error(err)
        throw new Error("Could not retrieve podcasts")
      })
    )
  }

   parseXmlToJson(xml: any) : Observable<IPodcast[]> {
    // With parser
     var podcasts : IPodcast[] = [];
     const parsedXml: Document = new DOMParser().parseFromString(xml, 'text/xml');
     var items = parsedXml.getElementsByTagName("item");
     Array.from(items).forEach( (item) => {
      var innerHtml = item.innerHTML;
      const titleHtml = new DOMParser().parseFromString(innerHtml, 'text/html');
      var title = titleHtml.getElementsByTagName("title")[0].innerHTML;
      title = title.slice(title.indexOf("CDATA")+6,title.length).replace("]]&gt;","");
      var desc = titleHtml.getElementsByTagName("description")[0].innerHTML
      desc = desc.slice(desc.indexOf("CDATA")+6,desc.length-5);
      var pcastHost = desc.slice(0,desc.indexOf("."));
      var podcastObj: IPodcast = {
        title: title,
        description: desc,
        link: titleHtml.getElementsByTagName("link")[0].innerHTML,
        pubDate: titleHtml.getElementsByTagName("pubDate")[0].innerHTML,
        audioType: "audio/mpeg",
        epImageLink: "https://www.dreamingspanish.com/apple-touch-icon.png",
        enclosure: titleHtml.getElementsByTagName("enclosure")[0].getAttribute("url") || "",
        starRating: 1,
        host: pcastHost,
        level: title.slice(0,title.search(":"))
      }
      podcasts.push(podcastObj);
     });
     return of(podcasts);

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
