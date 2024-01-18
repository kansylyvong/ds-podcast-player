import { IPodcast } from "../podcasts/podcast";

export interface AppState {
  podcasts: IPodcast[];
  hostFilter: string;
  levelFilter: string;
}

//create initialState with podcasts set to an empty array
const initialState: AppState = {
  podcasts: [],
  hostFilter: "",
  levelFilter: ""
};
