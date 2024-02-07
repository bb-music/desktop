import { create } from 'zustand';
import { bb_client } from '@wails/go/models';

interface VideoStoreState {
  data?: bb_client.VideoDetailResponse;
}
interface VideoStoreHandler {
  setData: (data: bb_client.VideoDetailResponse) => void;
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
