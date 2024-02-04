import { create } from 'zustand';
import { biliClient } from '@wails/go/models';

interface VideoStoreState {
  data?: biliClient.VideoDetailResponse;
}
interface VideoStoreHandler {
  setData: (data: biliClient.VideoDetailResponse) => void;
}

type VideoStore = VideoStoreState & VideoStoreHandler;

export const videoStore = create<VideoStore>()((set) => {
  return {
    data: void 0,
    setData: (data) => {
      set({ data });
    },
  };
});

export const useVideoStore = videoStore;
