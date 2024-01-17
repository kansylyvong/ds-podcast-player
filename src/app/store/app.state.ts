import { IPodcast } from "../podcasts/podcast";

export interface AppState {
  podcasts: IPodcast[];
}

//create initialState with podcasts set to an empty array
const initialState: AppState = {
  podcasts: []
};
