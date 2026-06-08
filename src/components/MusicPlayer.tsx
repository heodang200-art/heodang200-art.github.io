import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Volume2, VolumeX, List, CheckCircle2 } from 'lucide-react';
import { SongTrack } from '../types';

const PLAYLIST: SongTrack[] = [
  {
    id: 'track_1',
    title: 'Beautiful In White (Piano Solo)',
    artist: 'Richard Clayderman Cover',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'track_2',
    title: 'Until I Found You (Acoustic)',
    artist: 'Guitar Instrumental',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'track_3',
    title: 'A Thousand Years (Violin Theme)',
    artist: 'Melody Cover',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync track changes
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;
    
    audioRef.current.pause();
    audioRef.current.src = currentTrack.url;
    audioRef.current.load();
    
    if (wasPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  // Sync volume and mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.warn("User interaction required to start audio: ", err);
          // Try to resume on click anyway
        });
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setShowList(false);
    // Explicitly play after changing track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }, 150);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div id="wedding-music-player" className="fixed bottom-6 left-6 z-40">
      {/* Floating Compact Controller */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-stone-900/95 backdrop-blur-md text-stone-100 px-4 py-2.5 rounded-full border border-amber-500/30 shadow-2xl transition-all duration-300">
          <button 
            id="btn-play-music"
            onClick={togglePlay}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-stone-100 focus:outline-none transition-all duration-300 shadow-md ${
              isPlaying ? 'animate-spin-slow' : 'animate-bounce-slow'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex flex-col select-none pr-1">
            <span className="text-[10px] tracking-wider text-amber-400 font-semibold uppercase">Nhạc nền đám cưới</span>
            <span className="text-xs font-medium truncate max-w-[140px] text-stone-200">
              {currentTrack.title}
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-stone-800 pl-3">
            <button 
              id="btn-volume"
              onClick={toggleMute} 
              className="text-stone-400 hover:text-amber-400 transition-colors"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
            </button>
            
            <button 
              id="btn-list-songs"
              onClick={() => setShowList(!showList)} 
              className={`text-stone-400 hover:text-amber-400 transition-colors ${showList ? 'text-amber-400' : ''}`}
              title="Danh sách bài hát"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Floating Mini Playlist Selection */}
        {showList && (
          <div className="bg-stone-950/95 backdrop-blur-lg border border-stone-800 rounded-2xl p-3 shadow-2xl min-w-[240px] animate-fade-in text-stone-100">
            <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 px-1 border-b border-stone-900 pb-1.5 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" /> Chọn nhạc nền
            </h4>
            <div className="flex flex-col gap-1">
              {PLAYLIST.map((track, idx) => (
                <button
                  id={`btn-select-track-${idx}`}
                  key={track.id}
                  onClick={() => selectTrack(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all duration-200 ${
                    currentTrackIndex === idx 
                      ? 'bg-amber-950/50 text-amber-300 font-medium border-l-2 border-amber-500' 
                      : 'hover:bg-stone-900 text-stone-400'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="truncate font-medium">{track.title}</span>
                    <span className="text-[10px] text-stone-500">{track.artist}</span>
                  </div>
                  {currentTrackIndex === idx && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Glow Indicator for Autoplay Reminder */}
      {!isPlaying && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>
      )}
    </div>
  );
}
