'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input, Tooltip, Divider } from 'antd';
import { Player } from '@lottiefiles/react-lottie-player';
import playingicon from "@/app/icons/lottieflow-multimedia-8-8-000000-easey.json";

import { ShuffleEngine, SongCollection } from '@/app/types';
import { formatTime } from './utils';
import PlayerControls from '@/app/components/PlayerControls';
import VolumeControl from '@/app/components/VolumeControl';
import Playlist from '@/app/components/Playlist';
import Seekbar from '@/app/components/Seekbar';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(15);
  const [currentAlbumImage, setCurrentAlbumImage] = useState(FALLBACK_ALBUM_IMAGES[0]);
  const [currentAlbumImageIndex, setCurrentAlbumImageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialMount, setInitialMount] = useState(true);
  const [shuffleEngine, setShuffleEngine] = useState<ShuffleEngine | null>(null);
  const [isPeekPlaylistNumberLoading, setIsPeekPlaylistNumberLoading] = useState(true);
  const [peekMaxError, setPeekMaxError] = useState<string | null>(null);
  const [isPlaylistLoading, setIsPlaylistLoading] = useState(true);

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
    initShuffleEngineInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initShuffleEngineInstance = (peekMax?: number | undefined) => {
    const shuffleEngineInstance = new SongCollection(peekMax, JSON.parse(JSON.stringify(TRACKS)));
    shuffleEngineInstance.setSongs();
    setShuffleEngine(shuffleEngineInstance);

    setIsPeekPlaylistNumberLoading(false);

    return shuffleEngineInstance;
  }

  useEffect(() => {
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

    if (shuffleEngine?.getCurrentTrack().url) {
      setInitialMount(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.getCurrentTrack().url]);

  const loadAlbumImage = () => {
    const generateRandomIndex = () => Math.floor(Math.random() * ALBUM_IMAGES.length);
    let randomIndex = generateRandomIndex();
    while (ALBUM_IMAGES.length > 1 && !initialMount && randomIndex === currentAlbumImageIndex) {
      randomIndex = generateRandomIndex();
    }
    setCurrentAlbumImage(ALBUM_IMAGES[randomIndex]);
    setCurrentAlbumImageIndex(randomIndex);
  }


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

  const changeSong = (selectedIndex: number) => {
    if (shuffleEngine) {
      if (!shuffleEngine.getIsShuffleOn()) {
        shuffleEngine.changeCurrentTrackByOriginalOrderSongsIndex(selectedIndex);
      } else {
        shuffleEngine.changeCurrentTrackByShuffledSongsIndex(selectedIndex);
      }
    }
  }

  const nextTrack = () => {
    if (shuffleEngine) {
      if (shuffleEngine.getIsShuffleOn()) {
        shuffleEngine.setCurrentTrack(shuffleEngine?.getNextSong());
      } else {
        const originalOrderSongsParam = [...shuffleEngine.getOriginalOrderSongs().slice(1), shuffleEngine.getCurrentTrack()];
        shuffleEngine.setCurrentTrack(shuffleEngine.getOriginalOrderSongs()[0]);
        if (originalOrderSongsParam) shuffleEngine.resetQueue(originalOrderSongsParam);
      }

      loadAlbumImage();
    }
  };

  const prevTrack = () => {
    if (shuffleEngine) {
      if (!shuffleEngine.getIsShuffleOn()) {
        const originalOrderSongsParam = [
          shuffleEngine.getCurrentTrack(),
          ...shuffleEngine.getOriginalOrderSongs().slice(0, shuffleEngine?.getOriginalOrderSongs().length - 1)
        ];
        if (originalOrderSongsParam) shuffleEngine.resetQueue(originalOrderSongsParam);
        shuffleEngine.setCurrentTrack(shuffleEngine.getOriginalOrderSongs()[shuffleEngine.getOriginalOrderSongs().length - 1]);
      }

      loadAlbumImage();
    }
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

  const handleShuffle = () => {
    if (shuffleEngine) {
      if (shuffleEngine.getIsShuffleOn()) {
        shuffleEngine.setShuffleOff();
        if (!isPlaying) playPause();
      } else {
        setIsPlaylistLoading(true);
        shuffleEngine.setShuffleOn();
        shuffleEngine.shuffleSongs();
      }
    }
  }

  useEffect(() => {
    if (!initialMount && shuffleEngine?.getShuffledSongs().length) setIsPeekPlaylistNumberLoading(false);
    if (shuffleEngine?.peekQueue().length) {
      setTimeout(() => {
        setIsPlaylistLoading(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleEngine?.peekQueue()]);

  const handleSetPeekMax = (value: string) => {
    setIsPeekPlaylistNumberLoading(true);
    const newValue = parseInt(value, 10); // Parse input value to integer
    if (!isNaN(newValue) && newValue >= 1 && newValue <= 100) { // Check if input is a valid number between 1 and 100
      const oldShuffleEngineInstanceProps = {
        isShuffleOn: shuffleEngine?.getIsShuffleOn(),
        songs: shuffleEngine?.getShuffledSongs(),
        currentTrack: shuffleEngine?.getCurrentTrack(),
      };
      const newShuffleEngineInstance = initShuffleEngineInstance(newValue);
      if (newShuffleEngineInstance) {
        if (oldShuffleEngineInstanceProps.isShuffleOn) {
          newShuffleEngineInstance.setShuffleOn();
          newShuffleEngineInstance.shuffleSongs(oldShuffleEngineInstanceProps.songs);
        }
        if (oldShuffleEngineInstanceProps.currentTrack) newShuffleEngineInstance.setCurrentTrack(oldShuffleEngineInstanceProps.currentTrack);
        setShuffleEngine(newShuffleEngineInstance);
      }
      setPeekMaxError(null); // Clear error message when input is valid
    } else {
      setPeekMaxError('Please enter a number between 1 and 100.'); // Set error message when input is invalid
      setIsPeekPlaylistNumberLoading(false);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
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
          <p>{shuffleEngine?.getCurrentTrack().title}</p>
          <p>{formatTime(currentTime)} / {formatTime(duration)}</p>
        </div>

        <div className="controls">
          <PlayerControls
            isPlaying={isPlaying}
            togglePlayPause={playPause}
            playNext={nextTrack}
            playPrev={prevTrack}
            shuffle={shuffleEngine?.getIsShuffleOn()}
            toggleShuffle={handleShuffle}
          />
          <Seekbar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
          <VolumeControl volume={volume} setVolume={handleVolumeChange} />
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
        <Playlist
          currentTrack={shuffleEngine?.getCurrentTrack()}
          shuffledSongs={shuffleEngine?.peekQueue()}
          shuffleEngine={shuffleEngine}
          isPlaylistLoading={isPlaylistLoading}
          playingIcon={playingIcon}
          changeSong={changeSong}
          shuffle={shuffleEngine?.getIsShuffleOn()}
        />
      </div>

      <audio
        ref={audioRef}
        src={shuffleEngine?.getCurrentTrack().url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
};

export default MusicPlayer;
