import { Component, OnDestroy, OnInit } from "@angular/core";
import { IPodcast } from "./podcast";
import { PodcastService } from "./podcast.service";
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, distinct, filter, forkJoin, from, map, merge, mergeAll, mergeMap, of, reduce, tap, toArray } from "rxjs";
import { MatSelectChange } from "@angular/material/select";


@Component({
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit, OnDestroy {


  constructor(private podcastService: PodcastService) {
  }

  levels$ = of(['All','Superbeginner','Beginner','Intermediate','Advanced']);

  private levelSelectedSubject = new BehaviorSubject<string>('All');
  levelSelectedAction$ = this.levelSelectedSubject.asObservable();
  pageTitle: string = 'Podcasts List';
  showDescription: boolean = false;
  podcasts$: Observable<IPodcast[]> = this.podcastService.podcasts$.pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY
    })
  );
  filteredPodcasts$ = combineLatest([
    this.podcasts$,
    this.levelSelectedAction$
  ]).pipe(
    tap(levelSelectedAction => console.log(levelSelectedAction)),
    map(([podcasts, selectedLevel]) =>
      podcasts.filter((podcast) =>
      selectedLevel == 'All' ? true : podcast.title.includes(selectedLevel))
    ),
    catchError( err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )
  //this.podcasts$;
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
    return this.podcasts$.pipe(
      map(ep => ep.filter((podcast: IPodcast) =>
      podcast.description.toLowerCase().includes(filterBy))
    ))
  }

  onSelected(level: MatSelectChange) {
    console.log(level);
    this.levelSelectedSubject.next(level.value);

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

}
