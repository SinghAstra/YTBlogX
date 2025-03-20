import { Video } from "@prisma/client";
import { VideoAction } from "./video.types";

export const setUserVideos = (videos: Video[]): VideoAction => ({
  type: "SET_USER_VIDEOS",
  payload: videos,
});

export const addUserVideo = (video: Video): VideoAction => ({
  type: "ADD_USER_VIDEO",
  payload: video,
});
