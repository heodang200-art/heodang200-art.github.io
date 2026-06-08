import { useState, useEffect, useRef, FormEvent, MouseEvent } from 'react';
import { 
  Play, Pause, Music, Volume2, VolumeX, List, 
  CheckCircle2, Plus, Trash2, RotateCcw, AlertCircle, 
  Sparkles, X, HelpCircle 
} from 'lucide-react';
import { SongTrack } from '../types';

const DEFAULT_PLAYLIST: SongTrack[] = [
  {
    id: 'track_beautiful_white_vocal',
    title: 'Beautiful In White (Vocal)',
    artist: 'Westlife (Mặc định)',
    url: 'https://489-westlife.mp3.pm/song/150603442-beautiful-in-white/',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Instrumental fallback
  },
  {
    id: 'track_thinking_out_loud_vocal',
    title: 'Thinking Out Loud (Vocal)',
    artist: 'Ed Sheeran (Mặc định)',
    url: 'https://801676-edsheeran.mp3.pm/song/46640770-thinking-out-loud/',
    fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' // Instrumental fallback
  },
  {
    id: 'track_beautiful_piano',
    title: 'Beautiful In White (Hòa Tấu)',
    artist: 'Piano Solo Edit',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'track_until_i_found_you',
    title: 'Until I Found You (Acoustic)',
    artist: 'Guitar Instrumental',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'track_thousand_years',
    title: 'A Thousand Years (Violin Theme)',
    artist: 'Melody Cover',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState<SongTrack[]>(() => {
    const saved = localStorage.getItem('wedding_playlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved playlist', e);
      }
    }
    return DEFAULT_PLAYLIST;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [showList, setShowList] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'customize'>('list');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Form states for adding new track
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [formError, setFormError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Keep clean mutable ref to sync in listener
  const playlistRef = useRef(playlist);
  const currentTrackIndexRef = useRef(currentTrackIndex);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || DEFAULT_PLAYLIST[0];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(currentTrack ? currentTrack.url : DEFAULT_PLAYLIST[0].url);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;

    // Gracefully handle playback error (e.g. webpage URL instead of direct audio stream, CORS block)
    const handleAudioError = () => {
      if (!audioRef.current) return;
      const track = playlistRef.current[currentTrackIndexRef.current];
      
      if (track && track.fallbackUrl && audioRef.current.src !== track.fallbackUrl) {
        setErrorNotice(`⚠️ Đang chuyển sang bản Hòa Tấu chất lượng cao (Do liên kết chính thức bị chặn CORS hoặc không hỗ trợ nhúng trực tiếp).`);
        
        audioRef.current.pause();
        audioRef.current.src = track.fallbackUrl;
        audioRef.current.load();
        
        // Auto resume play of fallback if it was playing
        if (isPlayingRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }

        // Auto clear notice after 6 seconds
        setTimeout(() => setErrorNotice(null), 6000);
      } else {
        setErrorNotice(`⚠️ Không thể phát tệp âm thanh này. Hãy cung cấp đường dẫn tệp MP3 trực tiếp.`);
        setIsPlaying(false);
      }
    };

    audioRef.current.addEventListener('error', handleAudioError);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const wasPlaying = isPlaying;
    
    setErrorNotice(null);
    audioRef.current.pause();
    audioRef.current.src = currentTrack.url;
    audioRef.current.load();
    
    if (wasPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If play failed, might be CORS on the main URL, trigger error handler
          // HTMLAudioElement automatically triggers 'error' event to fallbackUrl
        });
    }
  }, [currentTrackIndex, playlist]);

  // Sync volume and mute
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Save playlist to state and localstorage
  const savePlaylist = (newPlaylist: SongTrack[]) => {
    setPlaylist(newPlaylist);
    localStorage.setItem('wedding_playlist', JSON.stringify(newPlaylist));
  };

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
          // Highlight click reminder
        });
    }
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    // Auto play select track
    const wasPlaying = isPlaying;
    setIsPlaying(true);
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Trigger automatic fallback if source errors out
          });
      }
    }, 150);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleAddTrack = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim()) {
      setFormError('Vui lòng nhập tên bài hát.');
      return;
    }
    if (!newUrl.trim()) {
      setFormError('Vui lòng nhập liên kết âm thanh.');
      return;
    }

    // Try to format links like dropbox
    let formattedUrl = newUrl.trim();
    if (formattedUrl.includes('dropbox.com') && formattedUrl.endsWith('dl=0')) {
      formattedUrl = formattedUrl.replace('dl=0', 'raw=1');
    }

    const newTrack: SongTrack = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Nhạc yêuêu thích',
      url: formattedUrl,
      fallbackUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Default instrumental safety fallback
    };

    const updatedPlaylist = [...playlist, newTrack];
    savePlaylist(updatedPlaylist);
    
    // Clear inputs
    setNewTitle('');
    setNewArtist('');
    setNewUrl('');
    
    // Switch to playlist tab and play the newly added song!
    setActiveTab('list');
    setCurrentTrackIndex(updatedPlaylist.length - 1);
    setIsPlaying(true);
  };

  const handleDeleteTrack = (idToDelete: string, e: MouseEvent) => {
    e.stopPropagation();
    if (playlist.length <= 1) {
      alert('Phải giữ lại ít nhất một bài hát trong danh sách.');
      return;
    }

    const indexToDelete = playlist.findIndex(t => t.id === idToDelete);
    const updatedPlaylist = playlist.filter(t => t.id !== idToDelete);
    
    // Calculate new current track index
    let newIndex = currentTrackIndex;
    if (currentTrackIndex === indexToDelete) {
      newIndex = Math.max(0, currentTrackIndex - 1);
    } else if (currentTrackIndex > indexToDelete) {
      newIndex = currentTrackIndex - 1;
    }

    savePlaylist(updatedPlaylist);
    setCurrentTrackIndex(newIndex);
  };

  const handleResetPlaylist = () => {
    if (confirm('Khôi phục danh sách nhạc đám cưới mặc định?')) {
      savePlaylist(DEFAULT_PLAYLIST);
      setCurrentTrackIndex(0);
      setIsPlaying(false);
      setErrorNotice(null);
    }
  };

  return (
    <div id="wedding-music-player" className="fixed bottom-6 left-6 z-40 max-w-[340px] md:max-w-[380px]">
      
      {/* Floating Compact Controller */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 bg-stone-950/95 backdrop-blur-md text-stone-100 px-4 py-3 rounded-full border border-amber-500/40 shadow-2xl transition-all duration-300">
          <button 
            id="btn-play-music"
            onClick={togglePlay}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-500 text-stone-100 focus:outline-none transition-all duration-300 shadow-md transform active:scale-95 ${
              isPlaying ? 'animate-spin-slow' : 'animate-bounce-slow'
            }`}
            title={isPlaying ? "Tạm dừng" : "Phát nhạc đám cưới"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex flex-col select-none pr-1">
            <span className="text-[9px] tracking-widest text-amber-400 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Nhạc nền đám cưới (Tùy chọn)
            </span>
            <span className="text-xs font-semibold truncate max-w-[130px] sm:max-w-[150px] text-stone-100">
              {currentTrack?.title}
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
              className={`text-stone-400 hover:text-amber-400 transition-colors p-1 rounded-md ${showList ? 'text-amber-400 bg-stone-900' : ''}`}
              title="Cài đặt & Danh sách bài hát"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Floating Warning Details notice */}
        {errorNotice && (
          <div className="bg-stone-950/95 border border-amber-500/30 text-stone-200 px-3 py-2 rounded-xl text-[10px] sm:text-xs shadow-xl animate-bounce-slow flex items-start gap-1.5 leading-relaxed">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Floating Playlist & Customizer Viewport */}
        {showList && (
          <div className="bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-2xl p-4 shadow-2xl w-[280px] sm:w-[320px] animate-fade-in text-stone-100 flex flex-col gap-3">
            
            {/* Header Dialog */}
            <div className="flex items-center justify-between border-b border-stone-900 pb-2">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" /> Quản lý nhạc nền
              </h4>
              <button 
                onClick={() => setShowList(false)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Selector Tab */}
            <div className="flex bg-stone-900 rounded-lg p-1 text-[11px]">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex-1 py-1 text-center rounded-[5px] transition-all font-medium ${
                  activeTab === 'list' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Danh sách phát
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex-1 py-1 text-center rounded-[5px] transition-all font-medium ${
                  activeTab === 'customize' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Tự chọn nhạc ⚙️
              </button>
            </div>

            {/* TAB CONTAINER: PLAYLIST LIST */}
            {activeTab === 'list' && (
              <div className="flex flex-col gap-1 max-h-[170px] overflow-y-auto pr-1 select-none">
                {playlist.map((track, idx) => (
                  <button
                    id={`btn-select-track-${idx}`}
                    key={track.id}
                    onClick={() => selectTrack(idx)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 ${
                      currentTrackIndex === idx 
                        ? 'bg-amber-950/40 text-amber-300 font-medium border-l-2 border-amber-500' 
                        : 'hover:bg-stone-900 text-stone-400'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate font-semibold text-[11px] sm:text-xs">
                        {track.title}
                      </span>
                      <span className="text-[9px] text-stone-500 italic truncate max-w-[170px]">
                        {track.artist}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {currentTrackIndex === idx && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      
                      {/* Only allow deleting if it's not the only track */}
                      {playlist.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteTrack(track.id, e)}
                          className="p-1 rounded text-stone-600 hover:text-rose-500 hover:bg-stone-800 transition-colors"
                          title="Xóa khỏi danh sách"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTAINER: CUSTOMIZER / SETTINGS */}
            {activeTab === 'customize' && (
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 text-left">
                
                {/* Visual Guide Toggle button */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowHelp(!showHelp)}
                    className="w-full py-1 text-[10px] text-amber-400/80 hover:text-amber-400 font-bold flex items-center gap-1 justify-center bg-stone-900/40 rounded-lg border border-stone-850"
                  >
                    <HelpCircle className="w-3 h-3" />
                    {showHelp ? "Thu gọn Hướng dẫn" : "Xem Hướng dẫn chọn nhạc (.mp3)"}
                  </button>
                  
                  {showHelp && (
                    <div className="mt-1.5 bg-stone-900 border border-stone-850 p-2 rounded-lg text-[9px] leading-relaxed text-stone-400 space-y-1">
                      <p className="font-bold text-amber-400 uppercase">⚠️ Lưu ý lấy link âm thanh:</p>
                      <p>• Trình duyệt yêu cầu tệp <span className="text-stone-300">.mp3 trực tiếp</span> (đường dẫn kết thúc bằng .mp3 tệp thô).</p>
                      <p>• <span className="font-bold">Dropbox:</span> Thay đổi đuôi <code className="text-amber-500 bg-stone-950 px-1 py-0.5 rounded">dl=0</code> thành <code className="text-amber-500 bg-stone-950 px-1 py-0.5 rounded">raw=1</code>.</p>
                      <p>• <span className="font-bold">Hệ thống an toàn:</span> Trường hợp đường dẫn nhạc của bạn quá hạn hoặc bị chặn CORS, trình phát sẽ tự động lấy bản Hòa Tấu mẫu trữ tình để thiệp cưới của bạn luôn lung linh!</p>
                    </div>
                  )}
                </div>

                {/* Form Add Track */}
                <form onSubmit={handleAddTrack} className="space-y-2.5 bg-stone-900/40 p-2.5 rounded-xl border border-stone-850">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-1">
                    Thêm nhạc lễ cưới của bạn
                  </span>

                  <div>
                    <label className="text-[9px] uppercase font-semibold text-stone-500 block mb-0.5">Tên bài hát *</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="vd: Beautiful in White"
                      className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-semibold text-stone-500 block mb-0.5">Nghệ sĩ / Ca sĩ</label>
                    <input
                      type="text"
                      value={newArtist}
                      onChange={(e) => setNewArtist(e.target.value)}
                      placeholder="vd: Westlife Cover"
                      className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-semibold text-stone-500 block mb-0.5">Liên kết âm thanh (Direct MP3 URL) *</label>
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://...file.mp3"
                      className="w-full bg-stone-950 border border-stone-800 rounded px-2 py-1 text-[10px] focus:outline-none focus:border-amber-500 text-stone-100 font-mono"
                    />
                  </div>

                  {formError && (
                    <span className="text-[9px] text-red-405 font-medium block">
                      ⚠️ {formError}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-100 rounded text-[10px] font-bold tracking-wider transition-all"
                  >
                    Thêm & Phát Ngay ♪
                  </button>
                </form>

                {/* Reset to Factory default */}
                <button
                  type="button"
                  onClick={handleResetPlaylist}
                  className="w-full py-1.5 bg-stone-900 hover:bg-stone-850/80 hover:text-white border border-stone-800 text-stone-400 rounded text-[10px] font-bold tracking-wider transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-amber-500" /> Khôi phục nhạc mặc định
                </button>
              </div>
            )}

            {/* Footer indicator status list */}
            <div className="text-[9px] font-mono text-stone-600 border-t border-stone-900 pt-1.5 text-center flex justify-between">
              <span>TRÌNH PHÁT AUTO-FALLBACK</span>
              <span>SLOTS: {playlist.length}</span>
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

