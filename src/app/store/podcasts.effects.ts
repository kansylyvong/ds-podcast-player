import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PodcastService } from '../services/podcast.service';
import { loadPodcasts, loadPodcastsSuccess, loadPodcastsFailure, login, loginSuccess, loginFailure } from './podcasts.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PodcastEffects {
  loadPodcasts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPodcasts),
      tap(() => console.log('loadPodcasts action triggered')),
      mergeMap(() => this.podcastService.podcasts$.pipe(

          map(podcasts => loadPodcastsSuccess({ podcasts })),
          catchError(error => of(loadPodcastsFailure(error.message)))
        )
      )
    )
  );
  login$ = createEffect(() =>
   this.actions$.pipe(
      ofType(login),
      mergeMap(action => this.authService.login(action.username, action.password).pipe(
        map(response => {
          if (response) {
            localStorage.setItem('access_token', response);
            return loginSuccess();
          } else {
            return loginFailure({ errorMessage: 'Invalid username or password' });
          }
        }),
        catchError(error => of(loginFailure({ errorMessage: error.message })))
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private podcastService: PodcastService,
    private authService: AuthService
  ) {}
}
