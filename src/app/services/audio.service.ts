import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { StreamState } from "../components/podcasts/streamState";

@Injectable({
  providedIn: "root"
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  private state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    progress:  0
  };

  private resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
      progress:  0
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        this.state.progress = (this.state.currentTime / (this.state.duration || 1)) * 100;
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private streamObservable(url: string) {
   return  new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }
  playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
   this.audioObj.pause();
   this.audioObj.currentTime = 0;
  }

  seekTo(seconds: number) {
    if (this.state && this.state.duration) {
      const pecentComplete = seconds / 100;
      this.audioObj.currentTime = pecentComplete * this.state.duration;
      this.state.progress = pecentComplete * 100;
    }
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }


}
