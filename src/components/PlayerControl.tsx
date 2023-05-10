import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faRepeat,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MutableRefObject, useEffect, useState } from "react";

interface Props {
  playPause: boolean;
  setPlayPause: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: number;
  setCurrentSong: React.Dispatch<React.SetStateAction<number>>;
  repeatSong: boolean;
  setRepeatSong: React.Dispatch<React.SetStateAction<boolean>>;
  musicList: Array<any>;
  audioPlayerRef: MutableRefObject<HTMLAudioElement | null>;
  progressBarRef: MutableRefObject<HTMLInputElement | null>;
}

export default function PlayerControl({
  audioPlayerRef,
  currentSong,
  setCurrentSong,
  musicList,
  playPause,
  setPlayPause,
  repeatSong,
  setRepeatSong,
}: Props) {
  const handleMusic = (action: string) => {
    if (action === "next") {
      if (currentSong === musicList.length - 1) {
        setCurrentSong(0);
      } else {
        setCurrentSong(currentSong + 1);
      }
    }
    if (action === "back") {
      if (currentSong === 0) {
        setCurrentSong(musicList.length - 1);
      } else {
        setCurrentSong(currentSong - 1);
      }
    }
  };

  return (
    <div className="player-controls my-4 flex items-center justify-center gap-2">
      <div className="shuffle-track">
        <FontAwesomeIcon icon={faShuffle} className="h-6 w-6" />
      </div>
      <div className="prev-track" onClick={() => handleMusic("back")}>
        <FontAwesomeIcon icon={faBackwardStep} className="h-6 w-6" />
      </div>
      <button
        onClick={() => setPlayPause(!playPause)}
        className="playpause-track flex h-12 w-12 items-center justify-center rounded-full bg-white"
      >
        {!playPause ? (
          <FontAwesomeIcon icon={faPlay} className="h-6 w-6"></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faPause} className="h-6 w-6"></FontAwesomeIcon>
        )}
      </button>
      <div className="next-track" onClick={() => handleMusic("next")}>
        <FontAwesomeIcon icon={faForwardStep} className="h-6 w-6" />
      </div>
      <div className="repeat-track" onClick={() => setRepeatSong(!repeatSong)}>
        <FontAwesomeIcon
          icon={faRepeat}
          className={`h-6 w-6 ${!repeatSong ? "text-black" : "text-blue-600"}`}
        />
      </div>
    </div>
  );
}
