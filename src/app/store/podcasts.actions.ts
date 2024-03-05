import { createAction, props } from '@ngrx/store';
import { IPodcast } from '../components/podcasts/podcast';

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

export const login = createAction(
  '[Login Page] User Login',
  props<{ username: string, password: string }>()
);

export const loginSuccess = createAction('[Login Page] Login Success');
export const loginFailure = createAction(
  '[Login Page] Login Failure',
  props<{ errorMessage: string }>()
);

export const markAsPlayed = createAction(
  '[Podcast List Component] Mark As Played',
  props<{ podcast: IPodcast }>()
);
