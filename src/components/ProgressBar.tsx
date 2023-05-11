import { useState } from "react";

interface Props {
  audioPlayerRef: React.RefObject<HTMLAudioElement>;
  progressBarRef: React.RefObject<HTMLInputElement>;
  duration: number;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}

const formatTime = (time: number) => {
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  return "0:00";
}

export default function ProgressBar({ progressBarRef, audioPlayerRef, duration, time }: Props) {
  const handleProgressChange = () => {
    if (audioPlayerRef.current?.currentTime) {
      audioPlayerRef.current.currentTime = progressBarRef.current!.valueAsNumber;
    }
  };

  return (
    <div className="slide_container flex justify-center gap-2">
      <div className="current-time text-sm">{formatTime(time)}</div>
      <input
        type="range"
        ref={progressBarRef}
        onChange={handleProgressChange}
        className="
          appearance-none 
          bg-transparent
          [&::-webkit-slider-runnable-track]:h-[4px]
          [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-runnable-track]:bg-black/60 
          [&::-webkit-slider-runnable-track]:bg-contain 
          [&::-webkit-slider-thumb]:h-[12px] 
          [&::-webkit-slider-thumb]:w-[12px] 
          [&::-webkit-slider-thumb]:translate-y-[-3.5px] 
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:rounded-[50%]
          [&::-webkit-slider-thumb]:bg-slate-800"
      />
      <div className="total-duration text-sm">
        {formatTime(duration)}
      </div>
    </div>
  );
}
