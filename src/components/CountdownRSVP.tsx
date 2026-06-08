import { useState, useEffect, FormEvent } from 'react';
import { Calendar, MapPin, Users, Heart, ClipboardCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// Import our database and service handles
import { db, saveLocalRSVP, isFirebaseConfigured, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { WeddingEventDetails } from '../types';

interface CountdownRSVPProps {
  weddingDateTimestamp: number;
}

const WEDDING_EVENTS: WeddingEventDetails[] = [
  {
    title: "LỄ VU QUY (Nhà Gái)",
    side: 'bride',
    time: "09:00 - Chủ Nhật, 21/06/2026",
    dateTimestamp: new Date("2026-06-21T09:00:00").getTime(),
    venueName: "FPT Software",
    address: "FPT Software",
    mapEmbedUrl: "https://maps.google.com/maps?q=FPT%20Software&t=&z=13&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl: "https://share.google/tCcNenRx7xY264oD6"
  },
  {
    title: "LỄ THÀNH HÔN (Nhà Trai)",
    side: 'groom',
    time: "11:30 - Chủ Nhật, 21/06/2026",
    dateTimestamp: new Date("2026-06-21T11:30:00").getTime(),
    venueName: "FPT Software",
    address: "FPT Software",
    mapEmbedUrl: "https://maps.google.com/maps?q=FPT%20Software&t=&z=13&ie=UTF8&iwloc=&output=embed",
    mapDirectionsUrl: "https://share.google/tCcNenRx7xY264oD6"
  }
];

export default function CountdownRSVP({ weddingDateTimestamp }: CountdownRSVPProps) {
  // Countdown states
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeEventTab, setActiveEventTab] = useState<'bride' | 'groom'>('bride');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [side, setSide] = useState<'bride' | 'groom' | 'both'>('bride');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [wishes, setWishes] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Countdown clock effect
  useEffect(() => {
    const calculateTime = () => {
      const difference = weddingDateTimestamp - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDateTimestamp]);

  const activeEvent = WEDDING_EVENTS.find(e => e.side === activeEventTab) || WEDDING_EVENTS[0];

  // Submit RSVP Form Logic
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      attendance,
      side,
      guestCount: attendance === 'yes' ? guestCount : 0,
      wishes: wishes.trim(),
      dietaryNotes: dietaryNotes.trim()
    };

    try {
      if (isFirebaseConfigured && db) {
        // Safe database save on Firestore
        const path = 'rsvps';
        try {
          await addDoc(collection(db, path), {
            ...payload,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, path);
        }
      } else {
        // Fallback to offline Local Storage Mockengine
        saveLocalRSVP(payload);
      }

      // Success
      setIsSubmitted(true);
      
      // Celebrate with fireworks!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      
    } catch (err: any) {
      setSubmitError('Một lỗi bảo mật hoặc kết nối đã xảy ra. Vui lòng thực hiện lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setAttendance('yes');
    setSide('bride');
    setGuestCount(1);
    setWishes('');
    setDietaryNotes('');
    setIsSubmitted(false);
  };

  return (
    <section id="rsvp-and-venues" className="py-20 bg-stone-100 text-stone-800">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Countdown Visual Circle Layout */}
        <div className="text-center mb-16">
          <span className="text-amber-600 font-serif italic text-lg block mb-2 tracking-wide font-medium">Đồ đếm thời gian</span>
          <h2 className="font-serif text-3xl md:text-4xl text-rose-950 font-bold tracking-tight mb-8">
            Thời Gian Đến Ngày Trọng Đại
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {[
              { label: 'Ngày', val: timeLeft.days, id: 'countdown-days' },
              { label: 'Giờ', val: timeLeft.hours, id: 'countdown-hours' },
              { label: 'Phút', val: timeLeft.minutes, id: 'countdown-minutes' },
              { label: 'Giây', val: timeLeft.seconds, id: 'countdown-seconds' }
            ].map(item => (
              <div 
                id={item.id}
                key={item.label}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border border-rose-50 flex flex-col justify-center items-center shadow-md animate-fade-in"
              >
                <span className="font-serif text-2xl md:text-3xl font-bold text-rose-950">{String(item.val).padStart(2, '0')}</span>
                <span className="text-[10px] md:text-xs text-stone-400 font-medium uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wedding Event Info & Map */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch mt-16">
          
          {/* Venues / Map section - 7 columns */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col flex-1 h-full">
              
              {/* Tabs header */}
              <div className="flex bg-stone-50 border-b border-stone-100 shrink-0">
                <button
                  id="tab-venue-bride"
                  onClick={() => setActiveEventTab('bride')}
                  className={`flex-1 text-center py-4 font-serif text-sm font-semibold tracking-wide transition-all ${
                    activeEventTab === 'bride' 
                      ? 'bg-white text-rose-950 border-b-2 border-amber-500' 
                      : 'text-stone-400 hover:text-stone-700 bg-stone-50/50'
                  }`}
                >
                  💍 Lễ Vu Quy (Nhà Gái)
                </button>
                <button
                  id="tab-venue-groom"
                  className={`flex-1 text-center py-4 font-serif text-sm font-semibold tracking-wide transition-all ${
                    activeEventTab === 'groom' 
                      ? 'bg-white text-rose-950 border-b-2 border-amber-500' 
                      : 'text-stone-400 hover:text-stone-700 bg-stone-50/50'
                  }`}
                  onClick={() => setActiveEventTab('groom')}
                >
                  🤵 Lễ Thành Hôn (Nhà Trai)
                </button>
              </div>

              {/* Venue details */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-rose-950 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" /> {activeEvent.title}
                  </h3>
                  
                  <div className="space-y-3.5 mb-6 text-sm text-stone-600 font-light pr-2">
                    <div className="flex items-start gap-2.5">
                      <span className="font-semibold text-rose-950 shrink-0 w-24">Thời gian:</span>
                      <span>{activeEvent.time}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-semibold text-rose-950 shrink-0 w-24">Địa điểm:</span>
                      <span className="font-medium text-stone-800">{activeEvent.venueName}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="font-semibold text-rose-950 shrink-0 w-24">Địa chỉ:</span>
                      <span>{activeEvent.address}</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps iFrame */}
                <div className="relative rounded-2xl overflow-hidden border border-stone-200/60 grow h-64 shadow-inner mb-6">
                  <iframe
                    src={activeEvent.mapEmbedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    title={`Bản đồ đi tới ${activeEvent.venueName}`}
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Directions external triggers */}
                <a
                  id="btn-directions-map"
                  href={activeEvent.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-xl text-xs font-semibold shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-400" /> Chỉ đường qua Google Maps <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </a>
              </div>
            </div>
          </div>

          {/* RSVP FORM section - 5 columns */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 md:p-8 flex flex-col justify-between flex-1 relative overflow-hidden h-full">
              {/* Top abstract rose pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-full blur-2xl z-0"></div>

              {!isSubmitted ? (
                <form id="rsvp-invitation-form" onSubmit={handleSubmit} className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-rose-950 mb-2 flex items-center gap-2">
                      <ClipboardCheck className="w-6 h-6 text-amber-600" /> Xác Nhận Tham Dự
                    </h3>
                    <p className="text-stone-400 text-xs font-light mb-6">
                      Để ban tổ chức chuẩn bị đón tiếp chu đáo nhất, xin vui lòng gửi xác nhận trước ngày 10/06/2026.
                    </p>

                    <div className="space-y-4">
                      {/* Name guest */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Họ & Tên khách mời *</label>
                        <input
                          id="input-guest-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Anh Nguyễn Tuấn Anh"
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60 font-medium"
                        />
                      </div>

                      {/* Phone number */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Số điện thoại khách (Bảo mật)</label>
                        <input
                          id="input-guest-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Chỉ dùng để ban tổ chức liên lạc"
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60 font-medium"
                        />
                      </div>

                      {/* Side and Attendance inline layout */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1">Phía khách của ai? *</label>
                          <select
                            id="select-guest-side"
                            value={side}
                            onChange={(e: any) => setSide(e.target.value)}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60"
                          >
                            <option value="bride">Bên Cô Dâu</option>
                            <option value="groom">Bên Chú Rể</option>
                            <option value="both">Cả Hai Bên</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-600 mb-1">Tham dự được không? *</label>
                          <select
                            id="select-guest-attendance"
                            value={attendance}
                            onChange={(e: any) => setAttendance(e.target.value)}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60 font-bold"
                          >
                            <option value="yes" className="text-green-600 font-bold">Sẽ Tham Dự (Yes)</option>
                            <option value="maybe" className="text-amber-600">Có Thể (Maybe)</option>
                            <option value="no" className="text-red-500">Rất Tiếc (No)</option>
                          </select>
                        </div>
                      </div>

                      {/* Guest Count (Conditional) */}
                      {attendance === 'yes' && (
                        <div className="animate-fade-in bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
                          <label className="block text-xs font-semibold text-rose-950 mb-1.5 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Số lượng khách đi cùng của bạn?
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                id={`btn-guest-count-${num}`}
                                key={num}
                                type="button"
                                onClick={() => setGuestCount(num)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  guestCount === num
                                    ? 'bg-rose-900 text-white shadow-sm ring-1 ring-amber-400'
                                    : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                                }`}
                              >
                                {num} {num === 5 ? '+' : ''}
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] text-rose-800 font-medium block mt-1.5">
                            Quý khách đăng ký {guestCount} chỗ ngồi tại bữa tiệc. Thank you!
                          </span>
                        </div>
                      )}

                      {/* Special Dietary request */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Ghi chú món ăn / Ghi chú đặc biệt</label>
                        <input
                          id="input-dietary"
                          type="text"
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                          placeholder="Ví dụ: Ăn chay trường, dị ứng hải sản, v.v..."
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60"
                        />
                      </div>

                      {/* Wish quotes */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Lời chúc gửi tới cặp đôi</label>
                        <textarea
                          id="textarea-wishes"
                          rows={3}
                          value={wishes}
                          onChange={(e) => setWishes(e.target.value)}
                          placeholder="Gửi lời chúc tốt đẹp nhất tới cô dâu và chú rể nhé..."
                          className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500/60 font-light resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-red-500 text-xs font-medium mt-3">{submitError}</p>
                  )}

                  <button
                    id="btn-submit-rsvp"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-6 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 focus:outline-none disabled:bg-stone-300 disabled:text-stone-500 font-serif font-bold rounded-xl text-sm tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'GỬI XÁC NHẬN RSVP 💌'}
                  </button>
                </form>
              ) : (
                /* Confetti celebration success screen */
                <div id="rsvp-success-screen" className="flex flex-col items-center justify-center text-center py-10 px-4 animate-scale-up h-full my-auto">
                  <div className="w-16 h-16 bg-green-50 rounded-full border border-green-200 flex items-center justify-center text-green-600 mb-6 shrink-0 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-rose-950 mb-3">Xác Nhận Thành Công!</h3>
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-6 text-xs text-stone-600 leading-relaxed max-w-sm">
                    <p className="font-medium text-stone-800 mb-1">Thông tin đã được ghi nhận bảo mật:</p>
                    <p>Khách mời: <span className="font-bold text-rose-950">{name}</span></p>
                    <p>Phía: <span className="font-semibold">{side === 'bride' ? 'Cô Dâu' : side === 'groom' ? 'Chú Rể' : 'Cả Hai Bên'}</span></p>
                    <p>Trạng thái: <span className="font-semibold text-green-600">Sẽ có mặt ({guestCount} người)</span></p>
                    {wishes && <p className="italic mt-2 text-stone-400 font-light border-t border-stone-200/50 pt-2 shrink text-[11px]">"{wishes}"</p>}
                  </div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed mb-6">
                    Mọi ý kiến của bạn đều được mã hóa tối đa để bảo vệ thông tin trước bên thứ ba. Hẹn gặp lại quý khách tại ngày vui của chúng tôi!
                  </p>

                  <button
                    id="btn-rsvp-reset"
                    onClick={handleResetForm}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-all cursor-pointer border border-stone-300"
                  >
                    Gửi xác nhận mới
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
