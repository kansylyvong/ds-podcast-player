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

  hosts$ = of(['All','Abraham','Adam','Adrià','Agustina','Aitana','Alan','Alexandra','Alfonso','Alfredo','Alma','Amey','Analía','Andrea','Andrés H','Bernardo','Betsy','Betsy C','Bianncka','Camilo','Carolina','César','Claudia','David & Adrián','Débora','Edgar','Edwin','Elías','Enrique','Fátima','How to Spanish','Ian','Isabel','Iván','Javier','Jose María','Jostin','Juan','Judit','Karlos','Laura','Lorena','Lorena O','Marce','María','María del Mar','Marifer','Marinés','Mariona','Mauricio','Maximiliano','Michelle','Montserrat','Nacho','Natalia','Núria','Pablo','Pablo\'s mom','Pati','Pilar','Rafael','Ramón','Ricardo','Ricardo R','Rocío','Sandra','Sergio','Sofía','Sonia & Alberto','Tamara','Tere','Tomás','Toni','Valeria','Victoria'])


  private levelSelectedSubject = new BehaviorSubject<string>('All');

  private levelSelectedHostSubject = new BehaviorSubject<string>('All');

  levelSelectedHostAction$ = this.levelSelectedHostSubject.asObservable();
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
    this.levelSelectedAction$,
    this.levelSelectedHostAction$
  ]).pipe(
    tap(levelSelectedAction => console.log(levelSelectedAction)),
    map(([podcasts, selectedLevel, selectedHost]) =>
      podcasts.filter((podcast) =>
      selectedLevel == 'All' ? true : podcast.title.includes(selectedLevel))
      .filter((podcast) =>
      selectedHost == 'All' ? true : podcast.description.includes(selectedHost)
      )
    ),
    catchError( err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

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

  onSelectedLevel(level: MatSelectChange) {
    console.log(level);
    this.levelSelectedSubject.next(level.value);

  }

  onSelectedHost(level: MatSelectChange) {
    console.log(level);
    this.levelSelectedHostSubject.next(level.value);

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
