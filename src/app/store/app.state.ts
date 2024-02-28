import { IPodcast } from "../components/podcasts/podcast";

export interface AppState {
  podcasts: IPodcast[];
  hostFilter: string;
  levelFilter: string;
  filteredPodcasts: IPodcast[];
  loggedIn: boolean;
  error: string | null;
}

//create initialState with podcasts set to an empty array
export const initialState: AppState = {
  podcasts: [],
  hostFilter: "",
  levelFilter: "",
  filteredPodcasts: [],
  loggedIn: false,
  error: null
};
