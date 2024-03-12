# High-Level Architecture: [Demo Link](https://music-player.malcolmtan.click/)
The React application is a music player that allows users to play songs, control playback, adjust volume, and view a playlist. The application includes the following components:

1. **MusicPlayer**: This component serves as the main interface for the music player. It integrates various sub-components and manages the playback logic, including loading songs, controlling playback, and handling shuffle functionality.
1. **ShuffleEngine**: This component defines the interface and implementation for shuffling songs. It includes methods for shuffling songs, managing the queue, and toggling shuffle mode.
2. **PlayerControls**: This component provides buttons for controlling playback, such as play/pause, skip forward/backward, and toggle shuffle mode.
3. **VolumeControl**: This component allows users to adjust the volume using a slider.
4. **Seekbar**: This component displays the playback progress and allows users to seek to a specific position in the track using a slider.
5. **Playlist**: This component displays the list of songs in the playlist, including the currently playing song and the remaining queued songs.
<img src="https://github.com/mlclmtan/music-player/assets/52649203/9dd27e98-b828-4301-a9aa-d473296e3914" height="1000">
<img src="https://github.com/mlclmtan/music-player/assets/52649203/a0d2f266-5a4f-405e-a075-d488352ca7ec" height="400">

## Introduction:
To provide users with a seamless music listening experience. It features a responsive user interface with intuitive controls for playing songs, adjusting volume, and navigating playlists. The application incorporates a ShuffleEngine interface to ensure that songs are played in shuffled loops, enhancing the listening experience by preventing repetition of the same sequence of songs.

## Additional Functions for Improved User Experience:
1. **Shuffle Mode**: Users can toggle shuffle mode on or off to randomize the order of songs in the playlist, adding variety to their listening experience.

2. **Volume Control**: The application includes a volume control slider, allowing users to adjust the volume according to their preferences.

3. **Seekbar**: A seekbar displays the current playback progress and allows users to seek to a specific position in the track, providing better control over playback.

4. **Playlist Length**: Users can set the maximum number of tracks to display in the playlist, enabling them to customize their listening queue.

## Documentation:
- Well-documented with comments explaining the functionality of each component and method
- Includes details on the interface of the ShuffleEngine, the purpose of each component, and instructions for developers to understand and maintain the codebase effectively
- Code adheres to best practices and follows a modular structure for easy scalability and maintainability

## TODO
1. REDUX
2. Prev track button for shuffle mode
3. Load all TRACK duration from mp3
4. Add Loop feat
5. Add category feat
6. [Add list animation](https://motion.ant.design/api/queue-anim)
7.  Integrate soundcloud/youtube stream (utilise BFF, SSC)
8.  Add lyrics
9.  SSR main UI
10. Refactor CSS

## BUG
1. After clicking next song, playing icon not animating
2. Dev mode: clicking next too fast, got error play() was interrupted by new load request
3. Song ended not auto to next song? fixed

## Corner Case
1. **Duplicate Song**: When switching from shuffle on to off, current playing song might duplicate with previous state of original sequence playlist.
2. **Empty Playlist**: Checks for an empty playlist and handles it gracefully to prevent errors when attempting to play songs or display the playlist.
3. **Handling of Shuffle Mode**: The code correctly manages the state of shuffle mode, toggling it on and off as per user input. It ensures that the shuffle mode is correctly reflected in the playback order and that songs are shuffled in a random order.
4. **Edge Cases in Shuffle Logic**: The ShuffleEngine component handles edge cases in the shuffle logic, ensuring that songs are shuffled effectively and that no two consecutive songs are the same. It also ensures that the first song in the shuffled queue is not the same as the last song in the remaining queue.
5. **Volume Control**: The volume control component handles edge cases related to volume adjustment, such as setting minimum and maximum volume limits and updating the volume state accordingly.
6. **Seekbar**: The seekbar component manages edge cases related to seeking playback progress, ensuring that the seekbar accurately reflects the current playback position and that users can seek to any position within the track.
7. **Playlist Length**: The application allows users to set the maximum number of tracks to display in the playlist. It handles edge cases related to input validation, ensuring that users can only input valid values within the specified range (1 to 100).
8. **Error Handling**: The code includes error handling mechanisms, such as displaying error messages for invalid user inputs and handling errors gracefully to prevent application crashes.
9. **Fallback for Missing Album Images**: In case an album image fails to load, the code falls back to a default image to ensure a smooth user experience.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

