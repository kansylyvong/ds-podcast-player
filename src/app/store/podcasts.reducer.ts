import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { IPodcast } from '../components/podcasts/podcast';
import { AppState, initialState as appStateInitial } from './app.state';
import { loadPodcasts, loadPodcastsFailure, loadPodcastsSuccess, setHostFilter, setLevelFilter, login, loginSuccess, loginFailure } from './podcasts.actions';

export const initialState: AppState = {
  ...appStateInitial
};

export const appReducer = createReducer(
  initialState,
  // Add `on` functions here to handle actions
  on(loadPodcasts, state => {
    console.log('state: ', state);
    return { ...state, loading: true };
  }),
  on(loadPodcastsSuccess, (state, { podcasts }) => {
    console.log('Loading podcasts success');
    return { ...state, podcasts, filteredPodcasts: podcasts, loading: false };
  }),
  on(loadPodcastsFailure, (state, { payload }) => {
    return { ...state, error: payload.errorMessage, loading: false };
  }),
  on(setHostFilter, (state, { host }) => {
    return {
      ...state,
      hostFilter: host,
      filteredPodcasts: state.podcasts.filter(podcast => {
         return ( (!host || host === 'ALL') || podcast.host === host ) &&
          ((state.levelFilter === '' || state.levelFilter === 'ALL') || podcast.level === state.levelFilter)
        })
    };
  }),
  on(setLevelFilter, (state, { level }) => {
    return {
      ...state,
      levelFilter: level,
      filteredPodcasts: state.podcasts.filter(podcast => {
        return ( (!level || level === 'ALL') || podcast.level === level) &&
        ((state.hostFilter === '' || state.hostFilter === 'ALL') || podcast.host === state.hostFilter)
      })
    };
  }),
  on(login, (state) => ({ ...state, loggedIn: false })),
  on(loginSuccess, (state) => ({ ...state, loggedIn: true })),
  on(loginFailure, (state) => ({ ...state, loggedIn: false }))
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
  selectPodcastsState,
  (state: AppState) => state.filteredPodcasts
);

export const selectLoggedIn = createSelector(
  selectPodcastsState,
  (state: AppState) => state.loggedIn
);
