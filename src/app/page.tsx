'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Slider } from 'antd';
import { FaBackward, FaForward, FaRegCirclePause, FaRegCirclePlay, FaRepeat, FaShuffle } from "react-icons/fa6";
import { Player } from '@lottiefiles/react-lottie-player';
import playingicon from "@/app/icons/lottieflow-multimedia-8-8-000000-easey.json";

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

interface ShuffleEngine {
  setSongs(songs: Song[]): void;
  getNextSong(currentSong: Song, tracks: Song[]): Song;
  peekQueue(): Song[];
  skipToSong?(songId: number): void;
  getIsShuffleOn(): boolean;
  setShuffleOn(): void;
  setShuffleOff(): void;
  resetQueue(songs: Song[]): void;
  getOriginalOrderSongs(): Song[];
}

interface Song {
  url: string;
  title: string;
  tags: string[];
}

class SongCollection implements ShuffleEngine {
  private songs: Song[] = [];
  private peekMax: number = 5;
  private isShuffleOn: boolean = false;
  private originalOrderSongs: Song[] = [];

  constructor(peekMax: number) {
    this.peekMax = peekMax;
  }

  getOriginalOrderSongs(): Song[] {
    return this.originalOrderSongs;
  }

  setSongs(songs: Song[]): void {
    if (this.originalOrderSongs.length === 0) this.originalOrderSongs = songs.slice(1, songs.length);
    if (this.isShuffleOn) {
      this.songs = songs;
    }
  }

  getNextSong(): Song {
    const nextSong = this.songs[0];
    const remainingSongs = this.songs.slice(1);

    if (this.peekMax < remainingSongs.length) {
      this.songs = remainingSongs;
      return nextSong;
    }
    const nonDuplicatedSongs = this.getNewShuffledSongs(remainingSongs)
    this.songs = [...remainingSongs, ...nonDuplicatedSongs];

    return nextSong;
  }

  setShuffleOn(): void {
    this.isShuffleOn = true;
  }

  setShuffleOff(): void {
    this.isShuffleOn = false;
  }

  getIsShuffleOn(): boolean {
    return this.isShuffleOn;
  }

  peekQueue(): Song[] {
    return this.songs.slice(0, this.peekMax);
  }

  private getNewShuffledSongs(remainingSongs: Song[]): Song[] {
    // newShuffledSongs should be shuffle of TRACKS, please ensure no two consecutive songs are the same, newShuffledSongs first element should not be the same as last element of remainingSongs
    // return newShuffledSongs

    const shuffled: Song[] = [];
    const songsToShuffle = JSON.parse(JSON.stringify(TRACKS)); // Create a deep copy of the original TRACKS array
    let lastSong = remainingSongs[remainingSongs.length - 1];
    let skippedSong;

    // Shuffle the songs until the last song in the remainingSongs array is not the same as the first song in the shuffled array
    while (songsToShuffle.length > 0) {
      const randomIndex = Math.floor(Math.random() * songsToShuffle.length);
      let songToAdd = songsToShuffle[randomIndex];

      if (songToAdd.url !== lastSong.url) { // The first song of new queue cannot be currentTrack
        shuffled.push(songToAdd);
        lastSong = songToAdd;
      } else {
        skippedSong = songToAdd;
      }
      songsToShuffle.splice(randomIndex, 1); // Remove the selected song from the temporary array
    }

    if (skippedSong) {
      shuffled.push(skippedSong);
    }

    return shuffled;
  }

  // reset queue to original order when shuffle is turned off. Find index of param "url" from TRACKS and set originalordersongs to the songs from that index+1 to the end of the array and the songs from 0 to index
  resetQueue(updatedSongs: Song[]): void {
    this.originalOrderSongs = updatedSongs;
  }
}

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(15);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [currentAlbumImage, setCurrentAlbumImage] = useState(FALLBACK_ALBUM_IMAGES[0]);
  const [currentAlbumImageIndex, setCurrentAlbumImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialMount, setInitialMount] = useState(true);
  const [shuffleEngine, setShuffleEngine] = useState<ShuffleEngine | null>(null);
  const [originalOrderSongs, setOriginalOrderSongs] = useState<Song[]>([]);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingIconRef = useRef<Player | null>(null);

  const playingIcon = <Player
    loop
    ref={playingIconRef}
    src={playingicon}
    style={{ height: '1.25rem', marginLeft: '0.5rem' }}
  />

  useEffect(() => {
    const shuffleEngineInstance = new SongCollection(5);
    shuffleEngineInstance.setSongs(JSON.parse(JSON.stringify(TRACKS)));
    setShuffleEngine(shuffleEngineInstance);
  }, []);

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
  }, [currentTrack.url]);


  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        playingIconRef.current?.play();
      } else {
        audioRef.current.pause();
        playingIconRef.current?.pause();
      }
    }
  }, [isPlaying]);

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const changeSong = (newIndex: number) => { } //! To be implemented

  const nextTrack = () => {
    if (shuffle) {
      setCurrentTrack(shuffleEngine?.getNextSong(currentTrack, TRACKS) || TRACKS[0]); //! FIX TRACKS[0]
      setShuffledSongs(shuffleEngine?.peekQueue() || []);
    } else {
      const originalOrderSongsParam = originalOrderSongs.slice(1).concat(currentTrack);
      if (originalOrderSongsParam) shuffleEngine?.resetQueue(originalOrderSongsParam);
      setCurrentTrack(originalOrderSongs[0]);
    }
  };

  const prevTrack = () => {
    if (!shuffle) {
      const originalOrderSongsParam = [
        currentTrack,
        ...originalOrderSongs.slice(0, originalOrderSongs.length - 1)
      ];
      if (originalOrderSongsParam) shuffleEngine?.resetQueue(originalOrderSongsParam);
      setCurrentTrack(originalOrderSongs[originalOrderSongs.length - 1]);
    } else { } //! Shuffled PrevTrack feat To be implemented
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

  const shuffleSongs = (songs: Song[]) => {
    let shuffled: Song[] = [];
    let songsToShuffle = JSON.parse(JSON.stringify(songs))

    while (songsToShuffle.length > 0) {
      const randomIndex = Math.floor(Math.random() * songsToShuffle.length);
      if (songsToShuffle[randomIndex].url !== currentTrack.url) { // * The first song of new queue cannot be currentTrack
        shuffled.push(songsToShuffle[randomIndex]);
      }
      songsToShuffle.splice(randomIndex, 1);
    }

    return shuffled;
  }

  const handleShuffle = () => {
    if (shuffleEngine) {
      if (shuffleEngine.getIsShuffleOn()) {
        shuffleEngine.setShuffleOff();
        setShuffle(false);
      } else {
        shuffleEngine.setShuffleOn();
        setShuffle(true);
      }
    }
  }

  useEffect(() => { // When shuffle is toggled, update the queue
    if (shuffleEngine) {
      if (shuffleEngine.getIsShuffleOn()) {
        const tempShuffled = shuffleSongs(TRACKS);
        shuffleEngine.setSongs(tempShuffled);
        setShuffledSongs(shuffleEngine.peekQueue());
      } else {
        shuffleEngine.setSongs(TRACKS); // reset the queue to original order
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getIsShuffleOn()]);

  useEffect(() => { // When non-shuffle queue is reset, update the queue
    if (shuffleEngine) {
      setOriginalOrderSongs(shuffleEngine.getOriginalOrderSongs());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getOriginalOrderSongs()]);

  return (
    <div className="container">
      <div className={`albumContainer ${isPlaying ? 'animate' : ''}`}>
        <Image
          src={currentAlbumImage}
          width={300}
          height={300}
          alt="Album Cover"
          className="albumImage"
          onError={() => setCurrentAlbumImage(FALLBACK_ALBUM_IMAGES[currentAlbumImageIndex % FALLBACK_ALBUM_IMAGES.length])}
          priority={true}
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="musicInfo">
        <p>{currentTrack.title}</p>
        <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
      </div>

      <div className="controls">
        <Button onClick={playPause} icon={isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />} type={isPlaying ? 'primary' : 'default'}>{isPlaying ? 'Pause' : 'Play'}</Button>
        <Button onClick={prevTrack} icon={<FaBackward />}>Previous</Button>
        <Button onClick={nextTrack} icon={<FaForward />}>Next</Button>
        <Button onClick={handleShuffle} icon={<FaShuffle />} type={shuffle ? 'primary' : 'default'}>{shuffle ? 'Shuffle On' : 'Shuffle Off'}</Button>
        <Button onClick={() => setLoop(!loop)} icon={<FaRepeat />} type={loop ? 'primary' : 'default'}>Loop</Button>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          className="volumeSlider"
        />
        <p>Volume: {volume}</p>
      </div>

      <div className="playlist">
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'lightblue' }}>
          <p>1. {currentTrack.title} </p>
          {playingIcon}
        </div>
        {shuffle
          ? (shuffledSongs.map((track, index) => (
            <div key={index} onClick={() => changeSong(index)}>
              <p>{index + 2}. {track.title}</p>
            </div>
          )))
          : originalOrderSongs.map((track, index) => (
            <div key={index} onClick={() => changeSong(index)}>
              <p>{index + 2}. {track.title}</p>
            </div>
          ))}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
};

export default MusicPlayer;
