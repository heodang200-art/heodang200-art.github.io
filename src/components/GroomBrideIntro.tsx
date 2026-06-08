import { useState } from 'react';
import { Heart, QrCode, Copy, Check, Gift } from 'lucide-react';
import { WeddingCoupleInfo } from '../types';

interface IntroProps {
  groom: WeddingCoupleInfo;
  bride: WeddingCoupleInfo;
}

export default function GroomBrideIntro({ groom, bride }: IntroProps) {
  const [activeGiftType, setActiveGiftType] = useState<'groom' | 'bride' | null>(null);
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(identifier);
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <section id="groom-bride-intro" className="py-20 px-4 max-w-6xl mx-auto text-stone-800">
      {/* section header */}
      <div className="text-center mb-16 relative">
        <span className="text-amber-600 font-serif italic text-lg block mb-2 tracking-wide">Ấn tượng đầu tiên</span>
        <h2 className="font-serif text-3xl md:text-4xl text-rose-950 font-bold tracking-tight inline-block relative pb-4">
          Cô Dâu & Chú Rể
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto mt-4 font-light leading-relaxed">
          Hai tâm hồn, hai mảnh ghép xa lạ tìm thấy sự đồng điệu và nguyện ước gắn bó trọn đời bên nhau.
        </p>
      </div>

      {/* Grid of Couple */}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        
        {/* Groom Card */}
        <div id="groom-card" className="flex flex-col bg-stone-50/70 border border-amber-950/5 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
          {/* Subtle floral texture mockup */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
          
          <div className="flex flex-col items-center text-center relative z-10 flex-1">
            {/* Elegant avatar container */}
            <div className="w-44 h-44 rounded-full p-1.5 border-2 border-amber-500/30 shadow-xl overflow-hidden mb-6 bg-white shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80" 
                alt="Chú rể" 
                className="w-full h-full object-cover rounded-full filter brightness-95 scale-102 hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <span className="bg-rose-950 text-amber-300 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 shadow-sm">
              Chú Rể (Groom)
            </span>
            
            <h3 className="font-serif text-2xl font-bold text-rose-950 mb-1">{groom.name}</h3>
            <p className="text-[11px] text-stone-400 font-mono tracking-wider mb-4">SINH NGÀY: {groom.birthdate}</p>
            
            {/* Parent section - Essential in Vietnam */}
            {(groom.father || groom.mother) && (
              <div className="bg-stone-100/80 px-4 py-3 rounded-2xl w-full border border-stone-200/50 text-xs text-stone-500 mb-5 leading-relaxed">
                <p className="font-semibold text-stone-700 mb-1 font-serif">Kính báo:</p>
                {groom.father && <p>Con ông: <span className="font-medium text-stone-800">{groom.father}</span></p>}
                {groom.mother && <p>Con bà: <span className="font-medium text-stone-800">{groom.mother}</span></p>}
              </div>
            )}
            
            <p className="text-stone-600 font-light text-sm leading-relaxed mb-6 flex-1 italic">
              "{groom.description}"
            </p>

            {/* Gift/Banking Trigger */}
            <button 
              id="btn-gift-groom"
              onClick={() => setActiveGiftType('groom')}
              className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-semibold shadow-md transition-all duration-300 cursor-pointer border border-amber-500/30"
            >
              <Gift className="w-4 h-4" /> Gửi mừng cưới Chú Rể
            </button>
          </div>
        </div>

        {/* Bride Card */}
        <div id="bride-card" className="flex flex-col bg-stone-50/70 border border-amber-950/5 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
          {/* Subtle floral texture mockup */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-600/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>

          <div className="flex flex-col items-center text-center relative z-10 flex-1">
            {/* Elegant avatar container */}
            <div className="w-44 h-44 rounded-full p-1.5 border-2 border-amber-500/30 shadow-xl overflow-hidden mb-6 bg-white shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&auto=format&fit=crop&q=80" 
                alt="Cô dâu" 
                className="w-full h-full object-cover rounded-full filter brightness-95 scale-102 hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <span className="bg-rose-950 text-amber-300 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 shadow-sm">
              Cô Dâu (Bride)
            </span>

            <h3 className="font-serif text-2xl font-bold text-rose-950 mb-1">{bride.name}</h3>
            <p className="text-[11px] text-stone-400 font-mono tracking-wider mb-4">SINH NGÀY: {bride.birthdate}</p>
            
            {/* Parent section - Essential in Vietnam */}
            {(bride.father || bride.mother) && (
              <div className="bg-stone-100/80 px-4 py-3 rounded-2xl w-full border border-stone-200/50 text-xs text-stone-500 mb-5 leading-relaxed">
                <p className="font-semibold text-stone-700 mb-1 font-serif">Kính báo:</p>
                {bride.father && <p>Con ông: <span className="font-medium text-stone-800">{bride.father}</span></p>}
                {bride.mother && <p>Con bà: <span className="font-medium text-stone-800">{bride.mother}</span></p>}
              </div>
            )}

            <p className="text-stone-600 font-light text-sm leading-relaxed mb-6 flex-1 italic">
              "{bride.description}"
            </p>

            {/* Gift/Banking Trigger */}
            <button 
              id="btn-gift-bride"
              onClick={() => setActiveGiftType('bride')}
              className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 bg-rose-950 text-amber-200 hover:text-white hover:bg-rose-900 rounded-xl text-xs font-semibold shadow-md transition-all duration-300 cursor-pointer border border-amber-500/30"
            >
              <Gift className="w-4 h-4" /> Gửi mừng cưới Cô Dâu
            </button>
          </div>
        </div>

      </div>

      {/* Sweet Quote Section */}
      <div className="mt-16 text-center max-w-xl mx-auto bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm">
        <Heart className="w-6 h-6 text-red-600 mx-auto mb-3 animate-pulse" />
        <p className="font-serif italic text-stone-700 text-sm leading-relaxed">
          "Được cùng nhau trải dài tháng năm, nhìn thấy sự bao dung từ ánh mắt, cảm nhận sự an tâm trong từng nhịp đập, đó chính là hành trình trọn vẹn của tình yêu."
        </p>
      </div>

      {/* Virtual Gift / Blessing Banking Modal */}
      {activeGiftType && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-amber-500/20 shadow-2xl max-w-md w-full p-6 relative animate-scale-up">
            <button 
              id="btn-close-gift-modal"
              onClick={() => setActiveGiftType(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg font-bold"
            >
              ×
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-700">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-rose-950">
                Mừng Cưới Đến {activeGiftType === 'groom' ? 'Chú Rể' : 'Cô Dâu'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Quý khách có thể mừng cưới online qua tài khoản ngân hàng hoặc quét mã QR dưới đây.
              </p>
            </div>

            {/* QR Code display */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 flex flex-col items-center justify-center mb-5">
              <img 
                src={activeGiftType === 'groom' ? groom.qrCodeUrl : bride.qrCodeUrl} 
                alt="Mã QR Chuyển Khoản" 
                className="w-48 h-48 object-contain rounded-xl shadow-md border border-stone-300"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-stone-400 mt-2 font-mono uppercase tracking-widest">Mã QR Chuyển Khoản VietQR</span>
            </div>

            {/* Detailed Account information */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-400">Ngân hàng:</span>
                <span className="font-semibold text-stone-700">
                  {activeGiftType === 'groom' ? groom.bankName : bride.bankName}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-400">Số tài khoản:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-rose-950">
                    {activeGiftType === 'groom' ? groom.bankAccount : bride.bankAccount}
                  </span>
                  <button 
                    id="btn-copy-acc-num"
                    onClick={() => handleCopy(activeGiftType === 'groom' ? groom.bankAccount : bride.bankAccount, 'acc')}
                    className="p-1 rounded hover:bg-stone-100 text-amber-700 shrink-0"
                    title="Sao chép"
                  >
                    {copiedState === 'acc' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                <span className="text-stone-400">Chủ tài khoản:</span>
                <span className="font-medium text-stone-700">
                  {activeGiftType === 'groom' ? groom.name : bride.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400">Chi nhánh:</span>
                <span className="text-stone-600">
                  {activeGiftType === 'groom' ? groom.bankBranch : bride.bankBranch}
                </span>
              </div>
            </div>

            <button 
              id="btn-gift-modal-done"
              onClick={() => setActiveGiftType(null)}
              className="w-full py-2.5 bg-rose-950 text-amber-200 hover:text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Hoàn Thành
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
