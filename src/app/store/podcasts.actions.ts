import { createAction, props } from '@ngrx/store';
import { IPodcast } from '../podcasts/podcast';

export const loadPodcasts = createAction('[Podcast List Component] Load Podcasts');

//create a loadPodcastsSuccess action
export const loadPodcastsSuccess = createAction(
  '[Podcast List Component] Load Podcasts Success',
  //add a payload of type IPodcast[]
  props<{ podcasts: IPodcast[] }>()
);

//create a loadPodcastsFailure action
export const loadPodcastsFailure = createAction(
  '[Podcast List Component] Load Podcasts Failure',
  //add a payload of type string
  (errorMessage: string) => ({ payload: { errorMessage } })
);

export const setHostFilter = createAction(
  '[Podcast List Component] Set Host Filter',
  props<{ host: string }>()
);

export const setLevelFilter = createAction(
  '[Podcast List Component] Set Level Filter',
  props<{ level: string }>()
);