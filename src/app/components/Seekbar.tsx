'use client'

import { Slider } from 'antd';

import { formatTime } from '../utils';

interface SeekbarProps {
    currentTime: number;
    duration: number;
    onSeek: (value: number) => void;
}

/**
 * Seekbar component for displaying and seeking the playback progress.
 * @param {object} props - The props object containing playback time and duration information.
 * @param {number} props.currentTime - The current playback time in seconds.
 * @param {number} props.duration - The total duration of the track in seconds.
 * @param {Function} props.onSeek - Function to handle seeking to a specific playback time.
 * @returns {JSX.Element} - Seekbar component.
 */
const Seekbar: React.FC<SeekbarProps> = ({ currentTime, duration, onSeek }) => {
    const handleSeek = (value: number) => {
        onSeek(value);
    };

    return (
        <div className="seekbar-container">
            <span style={{ marginRight: '10px' }}>{formatTime(currentTime)}</span>
            <Slider
                className="seekbar-slider"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                style={{ margin: '0 10px' }}
            />
            <span>{formatTime(duration)}</span>
        </div>
    );
};

export default Seekbar;
