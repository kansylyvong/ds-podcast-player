import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IPodcast } from '../podcasts/podcast';
import { AppState } from './app.state';
import { loadPodcasts, loadPodcastsFailure, loadPodcastsSuccess, setHostFilter, setLevelFilter } from './podcasts.actions';

export const initialState: IPodcast[] = [];

export const appReducer = createReducer(
  initialState,
  // Add `on` functions here to handle actions
  on(loadPodcasts, state => {
    console.log('state: ', state);
    return { ...state, loading: true };
  }),
  on(loadPodcastsSuccess, (state, { podcasts }) => {
    console.log('Loading podcasts success');
    return { ...state, podcasts, loading: false };
  }),
  on(loadPodcastsFailure, (state, { payload }) => {
    return { ...state, error: payload.errorMessage, loading: false };
  }),
  on(setHostFilter, (state, { host }) => {
    return { ...state, hostFilter: host };
  }),
  on(setLevelFilter, (state, { level }) => {
    return { ...state, levelFilter: level };
  }),
);

// Select the entire state
export const selectPodcastsState = createFeatureSelector<AppState>('podcasts');

// Select a piece of the state
export const selectAllPodcasts = createSelector(
  selectPodcastsState,
  (state: AppState) => state.podcasts
);
export const selectHostFilter = createSelector(
  selectPodcastsState,
  (state: AppState) => state.hostFilter
);
export const selectLevelFilter = createSelector(
  selectPodcastsState,
  (state: AppState) => state.levelFilter
);

export const selectFilteredPodcasts = createSelector(
  selectAllPodcasts,
  selectHostFilter,
  selectLevelFilter,
  (podcasts, hostFilter, levelFilter) => {
    return podcasts.filter(podcast => {
      return ((!hostFilter || hostFilter === 'All') || podcast.host === hostFilter) &&
             ((!levelFilter || levelFilter === 'All') || podcast.level === levelFilter);
    });
  }
);
