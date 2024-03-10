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

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, togglePlayPause, playNext, playPrev, shuffle, toggleShuffle }) => {
    return (
        <div className="control-buttons">
            <Button disabled={shuffle} onClick={playPrev} icon={<FaBackward />}><span className='button-text'>Previous</span></Button>
            <Button onClick={togglePlayPause} icon={isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />} type={isPlaying ? 'primary' : 'default'}><span className='button-text'>{isPlaying ? 'Pause' : 'Play'}</span></Button>
            <Button onClick={playNext} icon={<FaForward />}><span className='button-text'>Next</span></Button>
            <Button onClick={toggleShuffle} icon={<FaShuffle />} type={shuffle ? 'primary' : 'default'}><span className='button-text'>{shuffle ? 'Shuffle On' : 'Shuffle Off'}</span></Button>
        </div>
    );
};

export default PlayerControls;
