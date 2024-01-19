import { Component, OnDestroy, OnInit } from "@angular/core";
import { IPodcast } from "./podcast";
import { PodcastService } from "./podcast.service";
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, catchError, combineLatest, distinct, filter, forkJoin, from, map, merge, mergeAll, mergeMap, of, reduce, take, tap, toArray } from "rxjs";
import { MatSelectChange } from "@angular/material/select";
import { AudioService } from "./audio.service";
import { StreamState } from "./streamState";
import { Store, select } from '@ngrx/store';
import { loadPodcasts, setHostFilter, setLevelFilter } from '../store/podcasts.actions';
import { selectAllPodcasts, selectFilteredPodcasts, selectPodcastsState } from "../store/podcasts.reducer";
import { AppState } from "../store/app.state";
@Component({
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit, OnDestroy {


  constructor(private store: Store<AppState>,
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
  currentPodcastTitle: string = '';

  pageTitle: string = 'Podcasts List';
  showDescription: boolean = false;
  errorMessage = '';
  sub!: Subscription;
  rss!: Subscription;
  podcasts$!: Observable<IPodcast[]>;
  filteredPodcasts$!: Observable<IPodcast[]>;


  ngOnInit() {
    this.store.dispatch(loadPodcasts());
    this.podcasts$ = this.store.pipe(select(selectAllPodcasts));
    this.filteredPodcasts$ = this.podcasts$
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectedLevel(level: MatSelectChange) {
    this.store.dispatch(setLevelFilter({ level: level.value }));
    this.filteredPodcasts$ = this.store.pipe(select(selectFilteredPodcasts));

  }

  onSelectedHost(host: MatSelectChange) {
    this.store.dispatch(setHostFilter({ host: host.value }));
    this.filteredPodcasts$ = this.store.pipe(select(selectFilteredPodcasts));
  }
  openFile(podcast : IPodcast) : void {
    this.currentPodcast = {  podcast };
    this.audioService.stop();
    this.playStream(podcast.enclosure);
    this.currentPodcastTitle = podcast.title
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
    return false;
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
    this.filteredPodcasts$.pipe(take(1)).subscribe(podcasts => {
      const currentIndex = podcasts.findIndex(podcast => podcast.title === this.currentPodcastTitle);
      const nextIndex = currentIndex + 1;
      if (nextIndex < podcasts.length) {
        const nextPodcast = podcasts[nextIndex];
        this.openFile(nextPodcast);
      } else {
        console.log('This is the last podcast.');
      }
    });
  }

  onSliderChangeEnd(change: any) {
   this.audioService.seekTo(change);
  }

}
