'use client'

import { List, Skeleton, Typography } from 'antd';
import { Song, ShuffleEngine } from '../types';

interface PlaylistProps {
    currentTrack?: Song;
    shuffledSongs?: Song[];
    shuffleEngine: ShuffleEngine | null;
    isPlaylistLoading: boolean;
    playingIcon: JSX.Element;
    changeSong: (index: number) => void;
    shuffle?: boolean;
}

const Playlist: React.FC<PlaylistProps> = ({ currentTrack, shuffledSongs = [], shuffleEngine, isPlaylistLoading, playingIcon, changeSong, shuffle }) => {
    const playlistData = shuffle ? [currentTrack, ...shuffledSongs] : shuffleEngine ? [currentTrack, ...(shuffleEngine?.peekQueue() || [])] : []

    return (
        <div className="playlist">
            <Skeleton loading={isPlaylistLoading} active>
                <List
                    header={<Typography.Text underline>Playlist</Typography.Text>}
                    bordered
                    dataSource={playlistData}
                    renderItem={(item, index) => {
                        if (item) {
                            return <List.Item key={item.url} onClick={() => changeSong(index)}>
                                <Typography.Text className="playlist-item" mark={index === 0} strong={index === 0}>{index + 1}. {item.title}</Typography.Text>
                                <Typography.Text>{index === 0 && playingIcon}</Typography.Text>
                            </List.Item>
                        }
                    }
                    }
                />
            </Skeleton>
        </div>
    );
};

export default Playlist;
