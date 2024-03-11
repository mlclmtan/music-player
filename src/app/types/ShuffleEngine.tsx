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

  /**
   * Constructs a new SongCollection.
   * @param peekMax The maximum number of songs to peek.
   * @param tracks The array of songs.
   */
  constructor(peekMax: number | undefined, tracks: Song[]) {
    this.peekMax = peekMax ? peekMax : this.peekMax;
    this.tracks = tracks;
    this.currentTrack = this.tracks[0];
  }

  /**
   * Sets the maximum number of songs to peek in the playlist.
   * @param peekMax The maximum number of songs to peek.
   */
  setPeekMax(peekMax: number): void {
    this.peekMax = peekMax;
  }

  /**
   * Gets the maximum number of songs to peek in the playlist.
   * @returns The maximum number of songs to peek.
   */
  getPeekMax(): number {
    return this.peekMax;
  }

  /**
   * Sets the current track.
   * @param currentTrack The current track to set.
   */
  setCurrentTrack(currentTrack: Song): void {
    this.currentTrack = currentTrack;
  }

  /**
   * Gets the current track.
   * @returns The current track.
   */
  getCurrentTrack(): Song {
    return this.currentTrack;
  }

  /**
   * Sets the original order songs.
   * @param songs The original order songs to set.
   */
  setOriginalOrderSongs(songs: Song[]): void {
    if (songs) {
      this.originalOrderSongs = songs;
    }
  }

  /**
   * Gets the original order songs.
   * @returns The original order songs.
   */
  getOriginalOrderSongs(): Song[] {
    return this.originalOrderSongs;
  }

  /**
   * Gets the shuffled songs.
   * @returns The shuffled songs.
   */
  getShuffledSongs(): Song[] {
    return this.songs;
  }

  /**
   * Sets the songs for the shuffle engine.
   * @param songs The array of songs to set.
   */
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

  /**
   * Changes the current track based on the index of original order songs.
   * @param index The index of the original order songs.
   */
  changeCurrentTrackByOriginalOrderSongsIndex = (index: number): void => { // After changing the current track, add the remaining tracks from this.track from the index+1 to the end of the array and the songs from 0 to index
    const oldCurrentTrack = this.currentTrack;
    const remainingSongs = this.originalOrderSongs.slice(index);
    const newTrack = this.originalOrderSongs[index - 1];
    let songs = [...remainingSongs, oldCurrentTrack, ...this.originalOrderSongs.slice(0, index - 1)];
    this.currentTrack = newTrack;

    this.originalOrderSongs = songs;
  }

  /**
   * Changes the current track based on the index of shuffled songs.
   * @param index The index of the shuffled songs.
   */
  changeCurrentTrackByShuffledSongsIndex = (index: number): void => { // Remove all elements from index 0 till the index-1 from this.songs and add new shuffled songs to this.songs while this new array length < this.peekMax
    const oldCurrentTrack = this.currentTrack;
    const remainingSongs = this.songs.slice(index);
    const newTrack = this.songs[index - 1];
    let songs = [...remainingSongs, oldCurrentTrack, ...this.songs.slice(0, index - 1)];
    this.currentTrack = newTrack;

    this.songs = songs;
  }

  /**
   * Shuffles the songs in the collection.
   * @param remainingSongs Optional array of remaining songs to shuffle.
   */
  shuffleSongs(remainingSongs: Song[] = []): void {
    if (this.isShuffleOn) {
      let shuffledSongs: Song[] = remainingSongs;

      while (shuffledSongs.length < this.peekMax) {
        shuffledSongs.push(...this.getNewShuffledSongs(this.currentTrack));
      }

      this.setSongs(shuffledSongs);
    }
  }

  /**
   * Gets the next song in the shuffled queue.
   * @returns The next song.
   */
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

  /**
   * Peeks at the queue of songs, either shuffled or in original order.
   * @returns An array of songs representing the peeked queue.
   */
  peekQueue(): Song[] {
    if (this.isShuffleOn) {
      return this.songs.slice(0, this.peekMax);
    } else {
      return this.getOriginalOrderSongs().slice(0, this.peekMax);
    }
  }

  /**
   * Generates a new shuffled array of songs.
   * Ensures no two consecutive songs are the same, and the first element of the new shuffled array
   * is not the same as the last element of the remainingSongs array.
   * @param firstSongToAvoid The first song to avoid duplication with in the new shuffled array.
   * @returns The new shuffled array of songs.
   */
  private getNewShuffledSongs(firstSongToAvoid: Song): Song[] {

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

  /**
   * Resets the queue to the original order when shuffle is turned off.
   * Finds the index of the song URL in TRACKS and sets original order songs accordingly.
   * @param updatedSongs The updated array of songs.
   */
  resetQueue(updatedSongs: Song[]): void {
    if (this.isShuffleOn) {
      this.songs = updatedSongs;
    } else {
      this.originalOrderSongs = updatedSongs;
    }
  }
}
