import { VideoAction, VideoState } from "./video.types";

export const initialState: VideoState = {
  userVideos: [],
};

export function videoReducer(
  state: VideoState,
  action: VideoAction
): VideoState {
  switch (action.type) {
    case "SET_USER_VIDEOS":
      return {
        ...state,
        userVideos: [...action.payload],
      };
    case "ADD_USER_VIDEO":
      return {
        ...state,
        userVideos: [action.payload, ...state.userVideos],
      };
    default:
      return state;
  }
}
