'use client'

import { Slider } from 'antd';

interface VolumeControlProps {
    volume: number;
    setVolume: (value: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume }) => {
    const handleVolumeChange = (value: number) => {
        setVolume(value);
    };

    return (
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
    );
};

export default VolumeControl;
