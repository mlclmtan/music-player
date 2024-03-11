'use client'

import { Slider } from 'antd';

interface VolumeControlProps {
    volume: number;
    setVolume: (value: number) => void;
}

/**
 * VolumeControl component for adjusting the volume using a slider.
 * @param {object} props - The props object containing volume and setVolume function.
 * @param {number} props.volume - The current volume value.
 * @param {Function} props.setVolume - The function to set the volume.
 * @returns {JSX.Element} - VolumeControl component.
 */
const VolumeControl: React.FC<VolumeControlProps> = ({ volume, setVolume }) => {
    /**
     * Handles the volume change event.
     * @param {number} value - The new volume value.
     */
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
