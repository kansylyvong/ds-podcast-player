import { Component, OnDestroy, OnInit } from "@angular/core";
import { IPodcast } from "./podcast";
import { PodcastService } from "./podcast.service";
import { EMPTY, Observable, Subscription, catchError, distinct, filter, forkJoin, from, map, merge, mergeAll, mergeMap, of, reduce, tap, toArray } from "rxjs";


@Component({
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit, OnDestroy {


  constructor(private podcastService: PodcastService) {
  }
  pageTitle: string = 'Podcasts List';
  showDescription: boolean = false;
  podcasts$: Observable<IPodcast[]> = this.podcastService.podcasts$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  );
  filteredPodcasts$ = this.podcasts$;
  hosts$ = this.podcasts$.pipe(
    mergeAll(),
    distinct(v => v.host),
    map( x => x.host),
    toArray(),
  );

  currentPodcast: any = {};
  private _listFilter = '';
  errorMessage = '';
  sub!: Subscription;
  rss!: Subscription;
  state: any;
  get listFilter(): string {
    return  this._listFilter
  }


  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter: ' + value);
    this.filteredPodcasts$ = this.performFilter(value);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  performFilter(filterBy: string): Observable<IPodcast[]> {
    filterBy = filterBy.toLowerCase();
  /*  return this.podcasts$.filter((podcast: IPodcast) =>
    podcast.description.toLowerCase().includes(filterBy))*/
    return this.podcasts$.pipe(
      map(ep => ep.filter((podcast: IPodcast) =>
      podcast.description.toLowerCase().includes(filterBy))
    ))
  }
  openFile(podcast : IPodcast, index: number) : void {
    this.currentPodcast = { index, podcast };
    console.log('opened');
  }
  isFirstPlaying() {
    return false;
  }
  isLastPlaying() {
    return true;
  }

  pause() {

  }
  play() {

  }

  previous() {

  }

  next() {

  }
  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

}
