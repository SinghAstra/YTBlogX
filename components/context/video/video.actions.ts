import { Video } from "@prisma/client";
import { VideoAction } from "./video.types";

export const setUserRepositories = (videos: Video[]): VideoAction => ({
  type: "SET_USER_VIDEOS",
  payload: videos,
});

export const addUserRepository = (video: Video): VideoAction => ({
  type: "ADD_USER_VIDEO",
  payload: video,
});
