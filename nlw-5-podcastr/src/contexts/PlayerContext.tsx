import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  playNext: () => void;
  playPrev: () => void;
  tooglePlay: () => void;
  toogleLoop: () => void;
  toogleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

//? Aqui eu defino o formato dos dados que eu estou passando
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  //? Essa propriedade diz que eu posso ter qualquer coisa que venha do react
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toogleLoop() {
    setIsLooping(!isLooping);
  }

  function toogleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0);
  }

  const hasPrev = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrev() {
    if (hasPrev) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);

    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      playList,
      playNext,
      playPrev,
      isPlaying,
      isLooping,
      isShuffling,
      tooglePlay,
      toogleLoop,
      toogleShuffle,
      setPlayingState,
      clearPlayerState,
      hasPrev,
      hasNext,
    }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}