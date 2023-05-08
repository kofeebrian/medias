"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MP3Tag from "mp3tag.js";
import useSWR from "swr";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faBackwardStep, faForwardStep, faPause, faPlay, faRepeat, faShuffle, faVolumeHigh, faVolumeLow } from "@fortawesome/free-solid-svg-icons";

export default function Player() {
  const [musicList] = useState<
    Array<{
      title: string;
      artists: string[];
      musicSrc: string;
    }>
  >([
    {
      title: "Oreji",
      artists: ["Rie Kugimiya, Yui Horie, Eri Kitamura"],
      musicSrc: "/music/Orenji.mp3",
    },
  ]);

  const [playingList, setPlayingList] =
    useState<Array<{ title: string; artists: string[]; musicSrc: string }>>(
      musicList
    );
  const [currentSong, setCurrentSong] = useState<number>(0);
  const [playPause, setPlayPause] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);

  const onLoadMetadata = () => {
    const seconds = audioPlayerRef.current?.duration;
    console.log(audioPlayerRef.current);
    setDuration(seconds);
    progressBarRef.current!.max = `${seconds}`;
  }

  const [coverImage, setCoverImage] = useState<string>();


  useEffect(() => {
    if (audioPlayerRef.current) {
      if (playPause) {
        audioPlayerRef.current.play();
        setPlayPause(true);
      } else {
        audioPlayerRef.current.pause();
        setPlayPause(false);
      }
    }
  }, [playPause]);

  const fetcher = (url: URL) => fetch(url).then((res) => res.arrayBuffer());
  const { data, error } = useSWR("/music/Orenji.mp3", fetcher);

  useEffect(() => {
    if (data) {
      const mp3tag = new MP3Tag(data);
      mp3tag.read();

      const imageData = new Uint8Array(mp3tag.tags?.v2.APIC[0].data);
      const imageFormat = mp3tag.tags?.v2.APIC[0].format;
      // const base64String = Buffer.from(imageData).toString("base64");
      // setCoverImage(`data:${imageFormat};base64,${base64String}`);
      setCoverImage(URL.createObjectURL(new Blob([imageData], { type: imageFormat })));
    }
  }, [data]);

  const togglePlayPause = () => {
    setPlayPause((old) => !old);
  };

  return (
    <div className="player h-screen w-100 flex flex-col items-center justify-center gap-2 rounded-lg bg-teal-600/50">
      <audio
        ref={audioPlayerRef}
        src={playingList[currentSong].musicSrc}
        onLoadedMetadata={onLoadMetadata}
      />
      <div className="details text-center">
        <div className="now-playing">PLAYING X OF Y</div>
        <div className="track-art relative mx-auto my-2 h-48 w-48 overflow-hidden rounded-full bg-teal-600/50">
          {coverImage && (
            <Image src={coverImage} fill alt="playing-cover-image" />
          )}
        </div>
        <h1 className="track-name text-3xl">Track Name</h1>
        <p className="track-artist">Track Artist</p>
      </div>

      <div className="player-controls my-4 flex items-center justify-center gap-2">
        <div className="shuffle-track">

          <FontAwesomeIcon icon={faShuffle} className="h-6 w-6" />
        </div>
        <div className="prev-track">
          <FontAwesomeIcon icon={faBackwardStep} className="h-6 w-6" />
        </div>
        <button
          onClick={togglePlayPause}
          className="playpause-track flex h-12 w-12 items-center justify-center rounded-full bg-white"
        >
          {!playPause ? (
            <FontAwesomeIcon icon={faPlay} className="h-6 w-6"></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faPause} className="h-6 w-6"></FontAwesomeIcon>
          )}
        </button>
        <div className="next-track">
          <FontAwesomeIcon icon={faForwardStep} className="h-6 w-6" />
        </div>
        <div className="repeat-track">
          <FontAwesomeIcon icon={faRepeat} className="h-6 w-6" />
        </div>
      </div>

      <div className="slide_container flex justify-center gap-2">
        <div className="current-time text-sm">00:00</div>
        <input
          type="range"
          ref={progressBarRef}
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
        <div className="total-duration text-sm"></div>
      </div>
      <div className="slider_container flex justify-center gap-2">
        <FontAwesomeIcon icon={faVolumeLow} />
        <input
          type="range"
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
        <FontAwesomeIcon icon={faVolumeHigh} />
      </div>
    </div>
  );
}

// useEffect(() => {
//   const ffmpeg = createFFmpeg({
//     // log: true,
//     corePath: "http://localhost:3000/ffmpeg/ffmpeg-core.js",
//   });
//   (async () => {
//     try {
//       await ffmpeg.load();
//       ffmpeg.FS(
//         "writeFile",
//         "Orenji.mp3",
//         await fetchFile(
//           path.join(
//             "http://localhost:3000",
//             playingList[currentSong].musicSrc
//           )
//         )
//       );
//       await ffmpeg.run(
//         "-i",
//         "Orenji.mp3",
//         "-an",
//         "-c:v",
//         "copy",
//         "Orenji.jpg"
//       );
//       const data = ffmpeg.FS("readFile", "Orenji.jpg");
//       setTestCoverImageSrc(
//         URL.createObjectURL(new Blob([data.buffer], { type: "image/jpeg" }))
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   })();
// }, [playingList, currentSong]);