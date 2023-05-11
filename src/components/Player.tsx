"use client";

import Image from "next/image";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ProgressBar from "@/components/ProgressBar";
import VolumeControl from "./VolumeControl";
import PlayerControl from "./PlayerControl";

export default function Player() {
  const [musicList] = useState<
    Array<{
      title: string;
      imageSrc: string;
      musicSrc: string;
    }>
  >([
    {
      title: "Oreji",
      imageSrc: "/music/cover/Orenji.jpg",
      musicSrc: "/music/Orenji.mp3",
    },
    {
      title: "アイドル",
      imageSrc: "/music/cover/アイドル.jpg",
      musicSrc: "/music/アイドル.mp3",
    },
    {
      title: "女王蜂 - メフィスト",
      imageSrc: "/music/cover/女王蜂 - メフィスト.jpg",
      musicSrc: "/music/女王蜂 - メフィスト.mp3",
    },
    {
      title: "レクイエム (feat. 星街すいせい)",
      imageSrc: "/music/cover/レクイエム (feat. 星街すいせい).jpg",
      musicSrc: "/music/レクイエム (feat. 星街すいせい).mp3",
    },
  ]);

  const [playingList, setPlayingList] =
    useState<Array<{ title: string; imageSrc: string; musicSrc: string }>>(
      musicList
    );
  const [currentSong, setCurrentSong] = useState<number>(0);
  const [repeatSong, setRepeatSong] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [playPause, setPlayPause] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string>();

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const playAnimationRef = useRef<number>();

  const onLoadMetadata = () => {
    const seconds = audioPlayerRef.current!.duration;
    setDuration(seconds);
    progressBarRef.current!.max = `${seconds}`;
  };

  const repeat = useCallback(() => {
    const currentTime = audioPlayerRef.current?.currentTime ?? 0;
    setTime(currentTime);
    if (duration) {
      progressBarRef.current!.value = `${currentTime}`;

      if (duration === audioPlayerRef.current!.currentTime) {
        if (!repeatSong) {
          if (currentSong !== playingList.length - 1) {
            setCurrentSong(currentSong + 1);
          } else {
            setCurrentSong(0);
          }
        }
      }
    }

    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [currentSong, duration, playingList.length, repeatSong]);

  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.load();
      progressBarRef.current!.valueAsNumber = 0;
      setTime(0);
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioPlayerRef.current && playPause) {
      audioPlayerRef.current?.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else if (audioPlayerRef.current && !playPause) {
      audioPlayerRef.current?.pause();
      cancelAnimationFrame(playAnimationRef.current!);
    }
  }, [audioPlayerRef, playPause, currentSong, repeat]);

  useEffect(() => {
    setCoverImage(playingList[currentSong].imageSrc);
  }, [currentSong, playingList]);

  useEffect(() => {
    if (shuffle) {
      const shuffledList = [...musicList].sort(() => Math.random() - 0.5).slice(0, musicList.length);
      setPlayingList(shuffledList);
    } else {
      setPlayingList(musicList);
    }
  }, [musicList, shuffle]);

  return (
    <>
      <div className="player relative flex min-h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden">
        {coverImage && (
          <Image
            src={coverImage}
            fill
            alt="playing-bg-image"
            className="-z-[1000] object-cover blur-md"
          />
        )}
        <audio
          ref={audioPlayerRef}
          src={playingList[currentSong].musicSrc}
          onLoadedMetadata={onLoadMetadata}
          loop={repeatSong}
        />
        <div className="details flex flex-col items-center justify-center gap-3 text-center">
          <div className="now-playing">PLAYING X OF Y</div>
          <div className="track-art relative mx-auto my-2 h-48 w-48 overflow-hidden rounded-full bg-teal-600/50">
            {coverImage && (
              <Image src={coverImage} fill alt="playing-cover-image" />
            )}
          </div>
          <h1 className="track-name text-3xl">
            {playingList[currentSong].title}
          </h1>
          <p className="track-artist">Track Artist</p>
        </div>

        <PlayerControl
          musicList={playingList}
          audioPlayerRef={audioPlayerRef}
          progressBarRef={progressBarRef}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          repeatSong={repeatSong}
          setRepeatSong={setRepeatSong}
          playPause={playPause}
          setPlayPause={setPlayPause}
          shuffle={shuffle}
          setShuffle={setShuffle}
        />
        <ProgressBar
          audioPlayerRef={audioPlayerRef}
          progressBarRef={progressBarRef}
          duration={duration}
          time={time}
          setTime={setTime}
        />
        <VolumeControl audioPlayerRef={audioPlayerRef} />
      </div>
    </>
  );
}

// // Get Cover image from mp3 file with mp3tag.js
// import MP3Tag from "mp3tag.js";

// useEffect(() => {
//   if (data) {
//     const mp3tag = new MP3Tag(data);
//     mp3tag.read();

//     const imageData = new Uint8Array(mp3tag.tags?.v2.APIC[0].data);
//     const imageFormat = mp3tag.tags?.v2.APIC[0].format;
//     // const base64String = Buffer.from(imageData).toString("base64");
//     // setCoverImage(`data:${imageFormat};base64,${base64String}`);
//     setCoverImage(
//       URL.createObjectURL(new Blob([imageData], { type: imageFormat }))
//     );
//   }
// }, [data]);

// // Get Cover image from mp3 file with ffmpeg
// // Don't forget to setHeader to Cross Origin Isolate
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
