'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Slider } from 'antd';
import { FaBackward, FaForward, FaRegCirclePause, FaRegCirclePlay, FaRepeat, FaShuffle } from "react-icons/fa6";

const ALBUM_IMAGES = [
  'https://www.escapistmagazine.com/wp-content/uploads/2023/03/how-old-are-the-ive-members-1.jpg?fit=1200%2C762',
  'https://upload.wikimedia.org/wikipedia/commons/4/46/2023_MMA_IVE.jpg',
  'https://assets.teenvogue.com/photos/634db26f40ce7fba82300c09/master/w_1600%2Cc_limit/IVE3.png',
];

const FALLBACK_ALBUM_IMAGES = [
  '/ive_logo.png',
  '/Ive_-_I\'ve_Ive.png',
];

const TRACKS = [
  {
    url: "/IVE I AM.mp3",
    title: "IVE - I AM",
    tags: ["rock style"],
  },
  {
    url: "/IVE After LIKE.mp3",
    title: "IVE - After LIKE",
    tags: ["rock style"],
  },
  {
    url: "/IVE Baddie.mp3",
    title: "IVE - Baddie",
    tags: ["rock style"],
  },
  {
    url: "/IVE Either Way.mp3",
    title: "IVE - Either Way",
    tags: ["emotional"],
  },
  {
    url: "/IVE Kitsch.mp3",
    title: "IVE - Kitsch",
    tags: ["rock style"],
  },
  {
    url: "/IVE Lips.mp3",
    title: "IVE - Lips",
    tags: ["cute"],
  },
  {
    url: "/IVE Mine.mp3",
    title: "IVE - Mine",
    tags: ["cute"],
  },
  {
    url: "/IVE Off The Record.mp3",
    title: "IVE - Off The Record",
    tags: ["cute"],
  }
];

const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(15);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [currentAlbumImage, setCurrentAlbumImage] = useState(FALLBACK_ALBUM_IMAGES[0]);
  const [currentAlbumImageIndex, setCurrentAlbumImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialMount, setInitialMount] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadAlbumImage = () => {
      const generateRandomIndex = () => Math.floor(Math.random() * ALBUM_IMAGES.length);
      let randomIndex = generateRandomIndex();
      while (ALBUM_IMAGES.length > 1 && !initialMount && randomIndex === currentAlbumImageIndex) {
        randomIndex = generateRandomIndex();
      }
      setCurrentAlbumImage(ALBUM_IMAGES[randomIndex]);
      setCurrentAlbumImageIndex(randomIndex);
    };

    const playNextSong = () => {
      if (audioRef.current) {
        audioRef.current.load();
        setIsPlaying(true);
        audioRef.current.play();
      }
    }

    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }

    loadAlbumImage();

    if (!initialMount) {
      playNextSong();
    }

    setInitialMount(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);


  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeSong = (newIndex: number) => {
    setCurrentTrackIndex(newIndex);
  }

  const nextTrack = () => {
    if (shuffle) {
      const newIndex = Math.floor(Math.random() * TRACKS.length);
      changeSong(newIndex);
    } else {
      const newIndex = (currentTrackIndex + 1) % TRACKS.length;
      changeSong(newIndex);
    }
  };

  const prevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    changeSong(newIndex);
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
    setDuration(audioRef.current?.duration || 0);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className={`albumContainer ${isPlaying ? 'animate' : ''}`}>
        <Image
          src={currentAlbumImage}
          width={300}
          height={300}
          alt="Album Cover"
          className="albumImage"
          onError={() => setCurrentAlbumImage(FALLBACK_ALBUM_IMAGES[currentTrackIndex % FALLBACK_ALBUM_IMAGES.length])}
          priority={true}
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="musicInfo">
        <p>{TRACKS[currentTrackIndex].title}</p>
        <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
      </div>

      <div className="controls">
        <Button onClick={playPause} icon={isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay /> } type={isPlaying ? 'primary' : 'default'}>{isPlaying ? 'Pause' : 'Play'}</Button>
        <Button onClick={prevTrack} icon={<FaBackward />}>Previous</Button>
        <Button onClick={nextTrack} icon={<FaForward />}>Next</Button>
        <Button onClick={() => setShuffle(!shuffle)} icon={<FaShuffle />} type={shuffle ? 'primary' : 'default'}>{shuffle ? 'Shuffle On' : 'Shuffle Off'}</Button>
        <Button onClick={() => setLoop(!loop)} icon={<FaRepeat />} type={loop ? 'primary' : 'default'}>Loop</Button>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          className="volumeSlider"
        />
        {/* show volume */}
        <p>Volume: {volume}</p>
      </div>

      <div className="playlist">
        {TRACKS.map((track, index) => (
          <div
            key={index}
            style={index === currentTrackIndex ? { backgroundColor: 'lightblue' } : {}}
            onClick={() => changeSong(index)}
          >
            <p>{track.title}</p>
          </div>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
};

export default MusicPlayer;
