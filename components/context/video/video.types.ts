import { Video } from "@prisma/client";

export interface VideoState {
  userVideos: Video[];
}
export type VideoAction =
  | {
      type: "SET_USER_VIDEOS";
      payload: Video[];
    }
  | {
      type: "ADD_USER_VIDEO";
      payload: Video;
    };
