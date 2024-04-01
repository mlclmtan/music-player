'use client'

import { Button } from 'antd';
import { FaBackward, FaForward, FaRegCirclePause, FaRegCirclePlay, FaShuffle } from "react-icons/fa6";

interface PlayerControlsProps {
    isPlaying: boolean;
    togglePlayPause: () => void;
    playNext: () => void;
    playPrev: () => void;
    shuffle?: boolean;
    toggleShuffle: () => void;
}

/**
 * PlayerControls component for controlling playback and shuffle functionality.
 * @param {object} props - The props object containing control functions and states.
 * @param {boolean} props.isPlaying - Indicates whether the player is currently playing.
 * @param {Function} props.togglePlayPause - Function to toggle play/pause state.
 * @param {Function} props.playNext - Function to play the next track.
 * @param {Function} props.playPrev - Function to play the previous track.
 * @param {boolean} [props.shuffle] - Indicates whether shuffle mode is enabled.
 * @param {Function} props.toggleShuffle - Function to toggle shuffle mode.
 * @returns {JSX.Element} - PlayerControls component.
 */
const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, togglePlayPause, playNext, playPrev, shuffle, toggleShuffle }) => {
    return (
        <div className="control-buttons">
            <Button disabled={shuffle} onClick={playPrev} icon={<FaBackward />} size='large'><span className='button-text'>Previous</span></Button>
            <Button onClick={togglePlayPause} icon={isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />} type={isPlaying ? 'primary' : 'default'} size='large'><span className='button-text'>{isPlaying ? 'Pause' : 'Play'}</span></Button>
            <Button onClick={playNext} icon={<FaForward />} size='large'><span className='button-text'>Next</span></Button>
            <Button onClick={toggleShuffle} icon={<FaShuffle />} type={shuffle ? 'primary' : 'default'} size='large'><span className='button-text'>{shuffle ? 'Shuffle On' : 'Shuffle Off'}</span></Button>
        </div>
    );
};

export default PlayerControls;
