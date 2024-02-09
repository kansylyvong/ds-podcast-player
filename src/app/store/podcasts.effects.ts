import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PodcastService } from "../podcasts/podcast.service";
import { loadPodcasts, loadPodcastsSuccess, loadPodcastsFailure } from './podcasts.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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

  constructor(
    private actions$: Actions,
    private podcastService: PodcastService
  ) {}
}
