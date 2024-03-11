'use client'

import { Slider } from 'antd';

import { formatTime } from '../utils';

interface SeekbarProps {
    currentTime: number;
    duration: number;
    onSeek: (value: number) => void;
}

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
