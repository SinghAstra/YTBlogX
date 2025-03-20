import { createContext, useContext, useReducer } from "react";
import { initialState, videoReducer } from "./video.reducer";
import { VideoAction, VideoState } from "./video.types";

interface VideoContextType {
  state: VideoState;
  dispatch: React.Dispatch<VideoAction>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  return (
    <VideoContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}
