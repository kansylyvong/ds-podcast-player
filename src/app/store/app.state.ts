import { IPodcast } from "../components/podcasts/podcast";

export interface AppState {
  podcasts: IPodcast[];
  hostFilter: string;
  levelFilter: string;
  filteredPodcasts: IPodcast[];
}

//create initialState with podcasts set to an empty array
export const initialState: AppState = {
  podcasts: [],
  hostFilter: "",
  levelFilter: "",
  filteredPodcasts: []
};
