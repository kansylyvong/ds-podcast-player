import { Component, OnDestroy, OnInit } from "@angular/core";
import { IPodcast } from "./podcast";
import { PodcastService } from "./podcast.service";
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, distinct, filter, forkJoin, from, map, merge, mergeAll, mergeMap, of, reduce, tap, toArray } from "rxjs";
import { MatSelectChange } from "@angular/material/select";
import { AudioService } from "./audio.service";
import { StreamState } from "./streamState";
import { Store, select } from '@ngrx/store';
import { loadPodcasts } from '../store/podcasts.actions';
import { selectAllPodcasts } from "../store/podcasts.reducer";
@Component({
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit, OnDestroy {


  constructor(private store: Store,
              private podcastService: PodcastService,
             private audioService: AudioService) {

              this.audioService.getState().subscribe(state => {
                this.state = state;
              });
  }

  levels$ = of(['All','Superbeginner','Beginner','Intermediate','Advanced']);

  hosts$ = of(['All','Abraham','Adam','Adrià','Agustina','Aitana','Alan','Alexandra','Alfonso','Alfredo','Alma','Amey','Analía','Andrea','Andrés H','Bernardo','Betsy','Betsy C','Bianncka','Camilo','Carolina','César','Claudia','David & Adrián','Débora','Edgar','Edwin','Elías','Enrique','Fátima','How to Spanish','Ian','Isabel','Iván','Javier','Jose María','Jostin','Juan','Judit','Karlos','Laura','Lorena','Lorena O','Marce','María','María del Mar','Marifer','Marinés','Mariona','Mauricio','Maximiliano','Michelle','Montserrat','Nacho','Natalia','Núria','Pablo','Pablo\'s mom','Pati','Pilar','Rafael','Ramón','Ricardo','Ricardo R','Rocío','Sandra','Sergio','Sofía','Sonia & Alberto','Tamara','Tere','Tomás','Toni','Valeria','Victoria'])

  state: StreamState | undefined;
  currentPodcast: any = {};

  private levelSelectedSubject = new BehaviorSubject<string>('All');

  private levelSelectedHostSubject = new BehaviorSubject<string>('All');

  levelSelectedHostAction$ = this.levelSelectedHostSubject.asObservable();
  levelSelectedAction$ = this.levelSelectedSubject.asObservable();

  currentPodcastTitle: string = '';

  pageTitle: string = 'Podcasts List';
  showDescription: boolean = false;
  podcasts$ = this.store.pipe(select(selectAllPodcasts));

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

  private _listFilter = '';
  errorMessage = '';
  sub!: Subscription;
  rss!: Subscription;
  get listFilter(): string {
    return  this._listFilter
  }


  set listFilter(value: string) {
    this._listFilter = value;
    console.log('In setter: ' + value);
    this.filteredPodcasts$ = this.performFilter(value);
  }

  ngOnInit() {
    this.store.dispatch(loadPodcasts());
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
  openFile(podcast : IPodcast) : void {
    this.currentPodcast = {  podcast };
    this.audioService.stop();
    this.playStream(podcast.enclosure);
    this.currentPodcastTitle = podcast.title
    console.log('opened');
  }

  playStream(url: string) {
    this.audioService.playStream(url).subscribe(events => {
      // listening for fun here
    });
  }
  isFirstPlaying() {
    return false;
  }
  isLastPlaying() {
    return true;
  }

  pause() {
    this.audioService.pause();

  }
  play() {
    this.audioService.play();

  }
  stop() {
    this.audioService.stop();
  }

  previous() {

  }

  next() {

  }

  onSliderChangeEnd(change: any) {
    console.log(change)
   this.audioService.seekTo(change);
  }

}
