import { useState, useEffect } from 'react';
import { 
  Heart, Calendar, MapPin, Sparkles, ChevronDown, 
  Compass, ArrowUp, Milestone, MessageSquareHeart
} from 'lucide-react';

// Import subcomponents
import GroomBrideIntro from './components/GroomBrideIntro';
import CountdownRSVP from './components/CountdownRSVP';
import PhotoAlbum from './components/PhotoAlbum';
import ShareInvitation from './components/ShareInvitation';
import GuestManager from './components/GuestManager';
import MusicPlayer from './components/MusicPlayer';
import { WeddingCoupleInfo } from './types';

export default function App() {
  const [invitedGuest, setInvitedGuest] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Parse custom invitee parameter '?to=name'
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    if (toParam) {
      setInvitedGuest(toParam);
    }

    // Scroll top monitor
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pre-configured couple bios
  const groomInfo: WeddingCoupleInfo = {
    name: "Nguyễn Thế Anh",
    shortName: "Thế Anh",
    avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80",
    father: "Nguyễn Thế Hùng",
    mother: "Phạm Thu Hà",
    birthdate: "15/09/1997",
    description: "Một lập trình viên yêu nghệ thuật, thích khám phá và mong muốn cùng Thảo viết nên một chương mới tràn ngập niềm vui.",
    bankName: "Ngân hàng Thương mại Cổ phần Ngoại thương Việt Nam (Vietcombank)",
    bankAccount: "1133668899",
    bankBranch: "Chi nhánh Hà Nội",
    qrCodeUrl: "https://api.vietqr.io/image/970436-1133668899-qr_only.png?accountName=NGUYEN%2520THE%252520ANH&amount=1000000"
  };

  const brideInfo: WeddingCoupleInfo = {
    name: "Lê Phương Thảo",
    shortName: "Phương Thảo",
    avatar: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&auto=format&fit=crop&q=80",
    father: "Lê Minh Đức",
    mother: "Hoàng Thị Lan",
    birthdate: "22/11/1999",
    description: "Nhà thiết kế đồ họa mộng mơ, yêu mến sự yên bình và tin rằng tình yêu đích thực luôn bắt nguốn từ những thấu hiểu giản đơn.",
    bankName: "Ngân hàng Cổ phần Quân đội (MB bank)",
    bankAccount: "9988776655",
    bankBranch: "Chi nhánh Đà Nẵng",
    qrCodeUrl: "https://api.vietqr.io/image/970422-9988776655-qr_only.png?accountName=LE%2520PHUONG%2520THAO&amount=1000000"
  };

  const weddingDateTimestamp = new Date("2026-10-31T11:30:00").getTime();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans relative selection:bg-amber-100 selection:text-rose-950">
      
      {/* Floating Background Music Core Widget */}
      <MusicPlayer />

      {/* 1. HERO HOME COVER (SANG TRỌNG / ROYAL CRIMSON VISUALS) */}
      <header className="relative min-h-[95vh] md:min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-red-950 text-amber-100">
        
        {/* Intricate decorative border layout */}
        <div className="absolute inset-4 md:inset-8 border border-amber-500/10 rounded-2xl pointer-events-none"></div>
        <div className="absolute inset-5 md:inset-10 border border-amber-500/5 rounded-2xl pointer-events-none"></div>
        
        {/* Soft floating dust or lights effect in backend */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '2s' }}></div>

        {/* Outer classic floral ornaments illustration placeholder */}
        <div className="relative z-10 space-y-6 max-w-3xl py-12 md:py-20 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950/40 backdrop-blur-md rounded-full border border-amber-500/20 text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase text-amber-400 select-none animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> Save The Date
          </div>

          <p className="font-serif italic text-lg md:text-xl font-light text-amber-200/90 tracking-wide">
            Chào mừng đến với ngày trọng đại của chúng tôi
          </p>

          {/* Couples names display - Playfair style custom serif */}
          <div className="space-y-2 select-none">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-wide text-white drop-shadow-md py-1">
              Thế Anh <span className="text-amber-400 font-serif font-light text-3xl sm:text-4xl md:text-6xl mx-1 font-serif-italic">&</span> Phương Thảo
            </h1>
            <p className="text-xs sm:text-sm tracking-widest font-mono text-amber-300 font-medium">
              31 THÁNG 10 NĂM 2026 // HỘI HÔN CHUNG ĐÔI
            </p>
          </div>

          <div className="w-12 h-[1px] bg-amber-500/40 my-6"></div>

          {/* 💌 PERSONALIZED GUEST INVITE CARD - SUPERIOR VIETNAMESE UX FEATURE 💌 */}
          {invitedGuest ? (
            <div className="w-full max-w-md bg-stone-100/95 backdrop-blur-md border border-amber-500/30 rounded-3xl p-6 md:p-8 text-stone-900 shadow-2xl relative animate-scale-up z-20">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block mb-1">Trân Trọng Kính Mời Quý Khách</span>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-rose-950 mb-3 truncate px-2">
                {invitedGuest}
              </h2>
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-700 shrink-0">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600 animate-pulse" />
              </div>
              <p className="text-stone-500 text-xs font-light leading-relaxed mb-5">
                Sự hiện diện kính mời của bạn là vinh hạnh lớn nhất của gia đình hai bên Nhà Trai & Nhà Gái, cùng nhau chung vui và nâng chén rượu mừng cho ngày hạnh phúc trăm năm của Thế Anh & Phương Thảo.
              </p>
              
              <button
                id="btn-rsvp-hero"
                onClick={() => handleScrollToSection('rsvp-and-venues')}
                className="w-full py-3 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all tracking-wide cursor-pointer"
              >
                Xác Nhận Tham Dự Ngay 💌
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Tình yêu của hai chúng tôi vượt qua những thăng trầm để hôm nay, trước sự chứng kiến của người thân và bè bạn bè, nguyện hứa trọn đời kề vai sát cánh.
              </p>
              <button
                id="btn-learn-more"
                onClick={() => handleScrollToSection('groom-bride-intro')}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 hover:text-white rounded-xl text-xs font-semibold shadow-md transition-all tracking-wider text-amber-50 cursor-pointer border border-amber-500/20"
              >
                Xem Thông Tin Thiệp
              </button>
            </div>
          )}

          {/* Animated bounce indicator scroll down */}
          <button 
            id="btn-scroll-indicator"
            onClick={() => handleScrollToSection('groom-bride-intro')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 focus:outline-none hover:text-white transition-colors cursor-pointer"
          >
            <span className="text-[10px] tracking-widest font-mono uppercase font-light text-amber-400">Cuộn màn hình</span>
            <ChevronDown className="w-5 h-5 animate-bounce text-amber-400" />
          </button>
        </div>

        {/* Decorative corner borders for cover aesthetic */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500/10 rounded-tl-3xl m-4 md:m-8"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/10 rounded-tr-3xl m-4 md:m-8"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/10 rounded-bl-3xl m-4 md:m-8"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/10 rounded-br-3xl m-4 md:m-8"></div>
      </header>

      {/* 2. BRIDE AND GROOM INTRO MODULE */}
      <div id="section-couple">
        <GroomBrideIntro groom={groomInfo} bride={brideInfo} />
      </div>

      {/* 3. INTERACTIVE LOVE STORY TIME-AXIS (CÂU CHUYỆN TÌNH YÊU) */}
      <section id="love-timeline" className="py-20 px-4 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16 relative">
            <span className="text-amber-600 font-serif italic text-lg block mb-2 tracking-wide font-medium">Hành trình 5 năm</span>
            <h2 className="font-serif text-3xl md:text-4xl text-rose-950 font-bold tracking-tight inline-block relative pb-4">
              Câu Chuyện Tình Yêu
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mt-4 font-light leading-relaxed">
              Từng giai đoạn gặp gỡ, thử thách và thắp lửa, trân trọng giới thiệu đến bè bạn và quan khách của chúng tôi.
            </p>
          </div>

          {/* Timeline chart items */}
          <div className="relative border-l border-stone-200 pl-6 md:pl-10 space-y-12 max-w-2xl mx-auto font-light">
            
            {[
              {
                date: 'Tháng 10 / 2021',
                title: 'Lần Đầu Gặp Gỡ 👋',
                desc: 'Chúng tôi quen nhau trong một dự án thiết kế và phát triển sáng tạo tại Hà Nội. Anh là một lập trình viên khô khan, còn Thảo là cô nhà thiết kế mộng mơ, tràn ngập năng lượng tích cực.'
              },
              {
                date: 'Tháng 02 / 2022',
                title: 'Lời Tỏ Tình Ngọt Ngào ❤️',
                desc: 'Trong cái se lạnh của mùa xuân Hà Nội, Thế Anh đã thu hết can đảm để tỏ tình với Thảo dưới tháp cổ kính. Sự thấu hiểu dần gắn kết hai trái tim thành một nhịp.'
              },
              {
                date: 'Tháng 12 / 2025',
                title: 'Chiếc Nhẫn Cầu Hôn Của Anh 💍',
                desc: 'Trên bãi cát vàng Phú Quốc lãng mạn dưới hoàng hôn rực rỡ, Thế Anh quỳ gối trao chiếc nhẫn nhỏ xinh, Phương Thảo rưng rưng đồng ý cùng anh xây dựng tổ ấm vững bền.'
              },
              {
                date: 'Tháng 10 / 2026',
                title: 'Ngày Trái Ngọt Trăm Năm Cưới Hỏi 🎉',
                desc: 'Một đám cưới ấm cúng ghi nhận tình yêu ngọt ngào của chúng tôi. Kính mời toàn thể người thân và bè bạn đến chúc phúc cho hôn nhân trăm năm hòa hợp!'
              }
            ].map((node, index) => (
              <div key={index} className="relative group">
                {/* Node icon circle */}
                <div className="absolute -left-10.5 md:-left-14.5 top-0 w-8 h-8 rounded-full bg-rose-50 border border-amber-500/40 flex items-center justify-center text-rose-950 shadow-md group-hover:bg-rose-900 group-hover:text-amber-100 transition-all duration-300">
                  <Heart className="w-3.5 h-3.5" />
                </div>

                {/* Content details and info */}
                <div className="bg-white border border-stone-200/60 shadow-md p-6 rounded-2xl transition-all duration-300 group-hover:shadow-lg hover:-translate-y-0.5">
                  <span className="text-[11px] font-mono tracking-wider font-bold text-amber-600 block mb-1">{node.date}</span>
                  <h3 className="font-serif text-base font-bold text-rose-950 mb-2">{node.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-light">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. PHOTO ALBUM GRID MODULE */}
      <div id="section-album" className="bg-white">
        <PhotoAlbum />
      </div>

      {/* 5. COUNTDOWN & VENUES & SECURITY RSVP FORM */}
      <CountdownRSVP weddingDateTimestamp={weddingDateTimestamp} />

      {/* 6. SHARE INVITATION GENERATOR SHORTCUT */}
      <ShareInvitation />

      {/* 7. SECURE GUEST LIST ADMIN PANEL */}
      <GuestManager />

      {/* 8. FOOTER - GRATITUDE COUPLERS */}
      <footer className="bg-stone-950 text-stone-400 py-16 px-4 border-t border-stone-900 text-center select-none relative overflow-hidden">
        
        {/* Soft layout background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto space-y-6">
          <Heart className="w-8 h-8 text-rose-600 mx-auto fill-rose-600 animate-pulse" />
          
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            Chân Thành Cảm Ơn!
          </h3>
          
          <p className="text-xs font-light leading-relaxed text-stone-400/90 max-w-sm mx-auto">
            Sự có mặt, những lời chúc mừng và tình cảm nồng ấm của quý khách là món quà quý giá nhất dành cho hai chúng tôi. Hân hạnh được đón tiếp bạn sắp tới!
          </p>

          <div className="w-8 h-[1px] bg-stone-800 mx-auto"></div>

          <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Thế Anh & Phương Thảo
          </div>

          <p className="text-[10px] text-stone-600 font-mono pt-4 leading-none">
            © 2026 THIỆP CƯỚI BIÊN SOẠN BẢO MẬT ONLINE // ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>

      {/* BACK TO TOP FLOATING TRIGGER BUTTON */}
      {showScrollTop && (
        <button
          id="btn-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-rose-950/90 text-amber-100 hover:text-white hover:bg-rose-900 border border-amber-500/20 shadow-2xl flex items-center justify-center transition-all animate-bounce cursor-pointer"
          title="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
