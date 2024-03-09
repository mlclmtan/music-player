'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button, Slider, Input, Tooltip, Divider, List, Typography, Skeleton } from 'antd';
import { FaBackward, FaForward, FaRegCirclePause, FaRegCirclePlay, FaShuffle } from "react-icons/fa6";
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
  getShuffledSongs(): Song[];
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

  getShuffledSongs(): Song[] {
    return this.songs;
  }

  setSongs(songs: Song[]): void {
    if (!this.isShuffleOn && this.originalOrderSongs.length === 0) {
      this.originalOrderSongs = songs.slice(1, songs.length);
      if (this.originalOrderSongs.length < this.peekMax) {
        while (this.originalOrderSongs.length < this.peekMax) {
          this.originalOrderSongs = [...this.originalOrderSongs, ...songs];
        }
      }
    } else if (this.isShuffleOn) {
      while (this.songs.length < this.peekMax) {
        this.songs = [...this.songs, ...this.getNewShuffledSongs(this.songs)];
      }
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
    if (this.isShuffleOn) {
      return this.songs.slice(0, this.peekMax);
    } else {
      return this.originalOrderSongs.slice(0, this.peekMax);
    }
  }

  private getNewShuffledSongs(remainingSongs: Song[]): Song[] {
    // newShuffledSongs should be shuffle of TRACKS, please ensure no two consecutive songs are the same, newShuffledSongs first element should not be the same as last element of remainingSongs
    // return newShuffledSongs

    const shuffled: Song[] = [];
    const songsToShuffle = JSON.parse(JSON.stringify(TRACKS)); // Create a deep copy of the original TRACKS array
    let lastSong;
    let skippedSong;

    if (remainingSongs.length > 0) {
      lastSong = remainingSongs[remainingSongs.length - 1];
    }

    // Shuffle the songs until the last song in the remainingSongs array is not the same as the first song in the shuffled array
    while (songsToShuffle.length > 0) {
      const randomIndex = Math.floor(Math.random() * songsToShuffle.length);
      let songToAdd = songsToShuffle[randomIndex];

      if (lastSong && songToAdd.url !== lastSong.url) { // The first song of new queue cannot be currentTrack
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
  const [currentAlbumImage, setCurrentAlbumImage] = useState(FALLBACK_ALBUM_IMAGES[0]);
  const [currentAlbumImageIndex, setCurrentAlbumImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialMount, setInitialMount] = useState(true);
  const [shuffleEngine, setShuffleEngine] = useState<ShuffleEngine | null>(null);
  const [originalOrderSongs, setOriginalOrderSongs] = useState<Song[]>([]);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);
  const [peekMax, setPeekMax] = useState(5);
  const [isPeekPlaylistNumberLoading, setIsPeekPlaylistNumberLoading] = useState(true);
  const [peekMaxError, setPeekMaxError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingIconRef = useRef<Player | null>(null);

  const { Search } = Input;
  const playingIcon = <Player
    loop
    ref={playingIconRef}
    src={playingicon}
    style={{ height: '1.25rem', marginLeft: '0.5rem' }}
  />

  useEffect(() => {
    shuffleEngineInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peekMax]); // Update shuffle engine when peekMax changes

  const shuffleEngineInstance = () => {
    const shuffleEngineInstance = new SongCollection(peekMax);
    shuffleEngineInstance.setSongs(JSON.parse(JSON.stringify(TRACKS)));
    setShuffleEngine(shuffleEngineInstance);

    if (!initialMount) setIsPeekPlaylistNumberLoading(false);
  }

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
      shuffleEngine.setSongs(TRACKS);
      setShuffledSongs(shuffleEngine.peekQueue());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getIsShuffleOn()]);

  useEffect(() => {
    if (shuffleEngine && shuffleEngine.getIsShuffleOn()) {
      setShuffledSongs(shuffleEngine.peekQueue());
    }
    if (!initialMount && shuffleEngine?.getShuffledSongs().length) setIsPeekPlaylistNumberLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getShuffledSongs()]);

  useEffect(() => { // When non-shuffle queue is reset, update the queue
    if (shuffleEngine) {
      setOriginalOrderSongs(shuffleEngine.getOriginalOrderSongs());
    }
    if (!initialMount && shuffleEngine?.getOriginalOrderSongs().length) setIsPeekPlaylistNumberLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getOriginalOrderSongs()]);

  const handleSetPeekMax = (value: string) => {
    setIsPeekPlaylistNumberLoading(true);
    const newValue = parseInt(value, 10); // Parse input value to integer
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) { // Check if input is a valid number between 1 and 100
      setPeekMax(newValue);
      shuffleEngineInstance();
      setPeekMaxError(null); // Clear error message when input is valid
    } else {
      setPeekMaxError('Please enter a number between 1 and 100.'); // Set error message when input is invalid
      setIsPeekPlaylistNumberLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-column">
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
          <div className="control-buttons">
            <Button disabled={shuffle} onClick={prevTrack} icon={<FaBackward />}><span className='button-text'>Previous</span></Button>
            <Button onClick={playPause} icon={isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />} type={isPlaying ? 'primary' : 'default'}><span className='button-text'>{isPlaying ? 'Pause' : 'Play'}</span></Button>
            <Button onClick={nextTrack} icon={<FaForward />}><span className='button-text'>Next</span></Button>
            <Button onClick={handleShuffle} icon={<FaShuffle />} type={shuffle ? 'primary' : 'default'}><span className='button-text'>{shuffle ? 'Shuffle On' : 'Shuffle Off'}</span></Button>
          </div>
          <div className="volume-container">
            <p className="volume-text">Volume: {volume}</p>
            <Slider
              className="volume-slider"
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={100}
            />
          </div>
          <Tooltip title={peekMaxError || 'Enter number of tracks to show in your playlist (between 1 to 100)'}>
            <Search
              type="number"
              placeholder="5"
              enterButton="Set Playlist Length"
              loading={isPeekPlaylistNumberLoading}
              onSearch={handleSetPeekMax}
              onBlur={() => setPeekMaxError(null)}
              min={1}
              max={100}
              status={peekMaxError ? 'error' : ''}
            />
          </Tooltip>
        </div>
      </div>

      <Divider className='divider'></Divider>

      <div className="right-column">
        <div className="playlist">
          <Skeleton loading={isPeekPlaylistNumberLoading} active>
            <List
              header={<div>Playlist</div>}
              bordered
              dataSource={shuffle ? [currentTrack, ...shuffledSongs] : shuffleEngine ? [currentTrack, ...(shuffleEngine?.peekQueue())] : []}
              renderItem={(item, index) => (
                <List.Item key={item.url} onClick={() => changeSong(index)}>
                  <Typography.Text className="playlist-item" mark={index === 0}>{index + 1}. {item.title}</Typography.Text>
                  <Typography.Text>{index === 0 && playingIcon}</Typography.Text>
                </List.Item>
              )}
            />
          </Skeleton>
        </div>
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
