import { useState } from 'react';
import { Camera, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ALBUM_IMAGES = [
  {
    id: 'img_1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80',
    title: 'Nắm Tay Nhau Đi Suốt Cuộc Đời'
  },
  {
    id: 'img_2',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80',
    title: 'Nét Cười Rạng Rỡ Ngày Chung Đôi'
  },
  {
    id: 'img_3',
    url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?w=1000&auto=format&fit=crop&q=80',
    title: 'Biển Chiều Bình Yên'
  },
  {
    id: 'img_4',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1000&auto=format&fit=crop&q=80',
    title: 'Kỷ Niệm Đẹp Đẽ Trao Nhẫn Cưới'
  },
  {
    id: 'img_5',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&auto=format&fit=crop&q=80',
    title: 'Nguyện Ước Trọng Đời'
  },
  {
    id: 'img_6',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80',
    title: 'Phút Giây Hạnh Phúc Ngọt Ngào'
  }
];

export default function PhotoAlbum() {
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  const prevImage = () => {
    if (activeImageIdx === null) return;
    setActiveImageIdx((activeImageIdx - 1 + ALBUM_IMAGES.length) % ALBUM_IMAGES.length);
  };

  const nextImage = () => {
    if (activeImageIdx === null) return;
    setActiveImageIdx((activeImageIdx + 1) % ALBUM_IMAGES.length);
  };

  return (
    <section id="wedding-album" className="py-20 px-4 max-w-6xl mx-auto text-stone-800">
      
      {/* section header */}
      <div className="text-center mb-16 relative">
        <span className="text-amber-600 font-serif italic text-lg block mb-2 tracking-wide">Khoảnh khắc đáng nhớ</span>
        <h2 className="font-serif text-3xl md:text-4xl text-rose-950 font-bold tracking-tight inline-block relative pb-4">
          Album Ảnh Của Chúng Tôi
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto mt-4 font-light leading-relaxed">
          Từng góc chụp ghi dấu lại hành trình yêu đương, nụ cười ngọt ngào và những kỉ niệm không bao giờ phai mờ.
        </p>
      </div>

      {/* Album grid with responsive layout list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {ALBUM_IMAGES.map((img, idx) => (
          <div 
            id={`album-item-${idx}`}
            key={img.id}
            onClick={() => setActiveImageIdx(idx)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 border border-stone-200/50 shadow-md cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Image */}
            <img 
              src={img.url} 
              alt={img.title}
              className="w-full h-full object-cover filter brightness-95 group-hover:scale-108 transition-all duration-700" 
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay background details */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white select-none">
              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-widest mb-1 inline-flex items-center gap-1">
                <Camera className="w-3 h-3" /> Photo Shoot
              </span>
              <h4 className="font-serif text-sm font-semibold tracking-wide truncate">{img.title}</h4>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-300">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Fullscreen Lightbox Overlay */}
      {activeImageIdx !== null && (
        <div className="fixed inset-0 bg-stone-950/95 backdrop-blur-lg z-50 flex flex-col justify-between p-4 md:p-8 animate-fade-in select-none">
          
          {/* Header controls */}
          <div className="flex justify-between items-center text-white/80 shrink-0 border-b border-white/5 pb-4">
            <span className="text-xs font-mono select-none tracking-widest uppercase">
              Ảnh {activeImageIdx + 1} / {ALBUM_IMAGES.length}
            </span>
            <div className="flex items-center gap-4">
              <button
                id="btn-close-lightbox"
                onClick={() => setActiveImageIdx(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 hover:text-white transition-all cursor-pointer text-lg font-bold"
                title="Đóng Album"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central image display with swipe buttons */}
          <div className="flex-1 flex items-center justify-between gap-4 py-8 relative">
            <button
              id="btn-lightbox-prev"
              onClick={prevImage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all absolute left-0 md:static z-20 cursor-pointer shadow-md"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[70vh] w-full h-full flex flex-col justify-center items-center relative z-10 mx-auto">
              <img 
                src={ALBUM_IMAGES[activeImageIdx].url} 
                alt={ALBUM_IMAGES[activeImageIdx].title} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/5"
                referrerPolicy="no-referrer"
              />
            </div>

            <button
              id="btn-lightbox-next"
              onClick={nextImage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all absolute right-0 md:static z-20 cursor-pointer shadow-md"
              title="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom title display bar */}
          <div className="text-center shrink-0 border-t border-white/5 pt-4 text-white/90">
            <h4 className="font-serif text-base font-semibold tracking-wide">
              {ALBUM_IMAGES[activeImageIdx].title}
            </h4>
            <p className="text-[11px] text-stone-400 mt-1 uppercase font-mono tracking-widest">
              Cô Dâu Phương Thảo ❤️ Chú Rể Thế Anh
            </p>
          </div>

        </div>
      )}

    </section>
  );
}
