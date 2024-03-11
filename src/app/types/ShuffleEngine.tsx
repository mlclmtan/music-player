import { Song } from '.';

export interface ShuffleEngine {
  setSongs(songs?: Song[]): void;
  getNextSong(): Song;
  peekQueue(): Song[];
  skipToSong?(songId: number): void;
  getIsShuffleOn(): boolean;
  setShuffleOn(): void;
  setShuffleOff(): void;
  resetQueue(songs: Song[]): void;
  setOriginalOrderSongs(songs: Song[]): void;
  getOriginalOrderSongs(): Song[];
  getShuffledSongs(): Song[];
  setPeekMax(peekMax: number): void;
  getPeekMax(): number;
  setCurrentTrack(currentTrack: Song): void;
  getCurrentTrack(): Song;
  shuffleSongs(remainingSongs?: Song[]): void;
  changeCurrentTrackByOriginalOrderSongsIndex(index: number): void;
  changeCurrentTrackByShuffledSongsIndex(index: number): void;
}

export class SongCollection implements ShuffleEngine {
  private songs: Song[] = [];
  private peekMax: number = 5;
  private isShuffleOn: boolean = false;
  private originalOrderSongs: Song[] = [];
  private tracks: Song[] = [];
  private currentTrack: Song;

  constructor(peekMax: number | undefined, tracks: Song[]) {
    this.peekMax = peekMax ? peekMax : this.peekMax;
    this.tracks = tracks;
    this.currentTrack = this.tracks[0];
  }

  setPeekMax(peekMax: number): void {
    this.peekMax = peekMax;
  }

  getPeekMax(): number {
    return this.peekMax;
  }

  setCurrentTrack(currentTrack: Song): void {
    this.currentTrack = currentTrack;
  }

  getCurrentTrack(): Song {
    return this.currentTrack;
  }

  setOriginalOrderSongs(songs: Song[]): void {
    if (songs) {
      this.originalOrderSongs = songs;
    }
  }

  getOriginalOrderSongs(): Song[] {
    return this.originalOrderSongs;
  }

  getShuffledSongs(): Song[] {
    return this.songs;
  }

  setSongs(songs?: Song[]): void {
    if (!this.isShuffleOn && this.originalOrderSongs.length === 0) {
      this.originalOrderSongs = this.tracks.slice(1, this.tracks.length);
      while (this.originalOrderSongs.length < this.peekMax) {
        this.originalOrderSongs = [...this.originalOrderSongs, ...this.tracks];
      }
    } else if (this.isShuffleOn) {
      if (songs) {
        this.songs = songs;
      }
    }
  }

  changeCurrentTrackByOriginalOrderSongsIndex = (index: number): void => { // After changing the current track, add the remaining tracks from this.track from the index+1 to the end of the array and the songs from 0 to index
    const oldCurrentTrack = this.currentTrack;
    const remainingSongs = this.originalOrderSongs.slice(index);
    const newTrack = this.originalOrderSongs[index - 1];
    let songs = [...remainingSongs, oldCurrentTrack, ...this.originalOrderSongs.slice(0, index - 1)];
    this.currentTrack = newTrack;

    this.originalOrderSongs = songs;
  }

  changeCurrentTrackByShuffledSongsIndex = (index: number): void => { // Remove all elements from index 0 till the index-1 from this.songs and add new shuffled songs to this.songs while this new array length < this.peekMax
    const oldCurrentTrack = this.currentTrack;
    const remainingSongs = this.songs.slice(index);
    const newTrack = this.songs[index - 1];
    let songs = [...remainingSongs, oldCurrentTrack, ...this.songs.slice(0, index - 1)];
    this.currentTrack = newTrack;

    this.songs = songs;
  }

  // Shuffle this.tracks. If the shuffled array has less than peekMax number of songs, shuffle the tracks again and add the new songs to the shuffled array. Return the first song from the shuffled array.
  shuffleSongs(remainingSongs: Song[] = []): void {
    if (this.isShuffleOn) {
      let shuffledSongs: Song[] = remainingSongs;

      while (shuffledSongs.length < this.peekMax) {
        shuffledSongs.push(...this.getNewShuffledSongs(this.currentTrack));
      }

      this.setSongs(shuffledSongs);
    }
  }

  getNextSong(): Song {
    const nextSong = this.songs[0];
    const remainingSongs = this.songs.slice(1);

    if (this.peekMax < remainingSongs.length) {
      this.songs = remainingSongs;
      return nextSong;
    }
    const firstSongToAvoid = remainingSongs[remainingSongs.length - 1];
    const nonDuplicatedSongs = this.getNewShuffledSongs(firstSongToAvoid)
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
      return this.getOriginalOrderSongs().slice(0, this.peekMax);
    }
  }

  private getNewShuffledSongs(firstSongToAvoid: Song): Song[] {
    // newShuffledSongs should be shuffle of TRACKS, please ensure no two consecutive songs are the same, newShuffledSongs first element should not be the same as last element of remainingSongs
    // return newShuffledSongs

    const shuffled: Song[] = [];
    const songsToShuffle = JSON.parse(JSON.stringify(this.tracks)); // Create a deep copy of the original TRACKS array
    let lastSong;
    let skippedSong;

    lastSong = firstSongToAvoid;

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
    if (this.isShuffleOn) {
      this.songs = updatedSongs;
    } else {
      this.originalOrderSongs = updatedSongs;
    }
  }
}
