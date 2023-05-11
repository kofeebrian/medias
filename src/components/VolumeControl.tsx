import { faVolumeHigh, faVolumeLow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EventHandler, MutableRefObject, useEffect, useRef, useState } from "react";

interface Props {
  audioPlayerRef: MutableRefObject<HTMLAudioElement | null>;
}

export default function VolumeControl({ audioPlayerRef }: Props) {
  const [volume, setVolume] = useState<number>(50);
  const volumeInputRef = useRef<HTMLInputElement>(null);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setVolume(e.target.valueAsNumber);
  }

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current!.volume = volume / 100;
      
    }
  }, [audioPlayerRef, volume]);

  return (
    <div className="slider_container flex justify-center gap-2">
      <div>
        <FontAwesomeIcon icon={faVolumeLow} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        ref={volumeInputRef}
        value={volume}
        onChange={handleVolumeChange}
        className="
    w-1/2
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
      <div>
        <FontAwesomeIcon icon={faVolumeHigh} />
      </div>
    </div>
  );
}
