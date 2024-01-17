import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IPodcast } from '../podcasts/podcast';
import { AppState } from './app.state';
import { loadPodcastsFailure, loadPodcastsSuccess } from './podcasts.actions';

export const initialState: IPodcast[] = [];

export const appReducer = createReducer(
  initialState,
  // Add `on` functions here to handle actions
  on(loadPodcastsSuccess, (state, { podcasts }) => {
    return { ...state, podcasts };
  }),
  on(loadPodcastsFailure, (state, { payload }) => {
    return { ...state, error: payload.errorMessage };
  })
);

// Select the entire state
export const selectPodcastsState = createFeatureSelector<AppState>('podcasts');

// Select a piece of the state
export const selectAllPodcasts = createSelector(
  selectPodcastsState,
  (state: AppState) => state.podcasts
);
