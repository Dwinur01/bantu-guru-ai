import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Heart, Target, Sparkles, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 animate-page">
      {/* Header */}
      <header className="w-full bg-slate-900 py-16 px-6 text-center text-white relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[80px]" />
        
        <div className="max-w-4xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Tentang <span className="gradient-text-blue">GuruBantu AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Menghadirkan efisiensi administrasi sekolah terbaik untuk kesejahteraan para guru honorer di seluruh penjuru Indonesia.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        
        {/* Story Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
              🌱 LATAR BELAKANG
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
              Misi Kami: Membebaskan Waktu Guru untuk Mengajar
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              GuruBantu AI lahir dari keprihatinan mendalam terhadap rumitnya birokrasi dan administrasi sekolah yang harus dihadapi oleh para guru di Indonesia, terutama guru honorer. 
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Waktu berharga yang seharusnya digunakan untuk mendampingi tumbuh kembang siswa atau beristirahat, sering kali habis untuk menyusun ratusan dokumen RPP dan Modul Ajar secara manual. Kami hadir untuk mendemokrasikan kecerdasan buatan (AI) agar menjadi asisten administrasi instan guru secara gratis.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 relative hover-card-premium">
            <Heart className="w-12 h-12 text-rose-500 animate-pulse" />
            <h3 className="font-display font-black text-lg text-slate-800">Dibuat Dengan Kepedulian</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Kami percaya dengan mendampingi guru membebaskan waktu administrasi mereka, kualitas pendidikan generasi bangsa Indonesia akan meningkat secara nyata.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Visi */}
          <div className="glass-card border border-white/50 rounded-3xl p-8 shadow-sm space-y-4 hover-card-premium">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-black text-lg text-slate-900">Visi Kami</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Menjadi platform asisten mengajar berbasis AI nomor satu di Indonesia yang mendampingi jutaan guru dalam penyederhanaan kurikulum, asesmen cerdas, dan berbagi inovasi modul pembelajaran.
            </p>
          </div>

          {/* Misi */}
          <div className="glass-card border border-white/50 rounded-3xl p-8 shadow-sm space-y-4 hover-card-premium">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-display font-black text-lg text-slate-900">Misi Kami</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Menyediakan alat bantu ajar kurikulum Kemendikbud otomatis, memastikan transaksi kuota yang adil dan aman, serta membangun perpustakaan bersama agar sesama guru dapat saling menginspirasi.
            </p>
          </div>
        </section>

        {/* Key Values */}
        <section className="space-y-6 text-center">
          <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Nilai-Nilai Utama Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Edukatif', desc: 'Seluruh RPP & Soal mengadopsi standar taksonomi Bloom dan struktur Kurikulum Merdeka Kemendikbud.' },
              { icon: Sparkles, title: 'Inovatif', desc: 'Terus memperbarui asisten cerdas AI kami menggunakan model bahasa Google Gemini termutakhir.' },
              { icon: Heart, title: 'Aksesibel', desc: 'Kami berkomitmen untuk selalu mempertahankan paket Gratis selamanya bagi guru Indonesia.' }
            ].map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-black text-sm text-slate-800">{val.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-premium">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-xl" />
          <div className="space-y-6 relative z-10">
            <h3 className="font-display text-2xl font-black tracking-tight">Mari Mulai Transformasi Cara Mengajar Anda!</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Bergabunglah bersama ribuan guru honorer Indonesia lainnya dan buat RPP Anda dalam hitungan detik.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary px-8 py-3.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-xl">
                Coba Gratis Sekarang
              </Link>
              <Link to="/" className="btn-glow-white px-6 py-3.5 rounded-xl text-xs font-bold text-slate-800 border border-slate-200 bg-white/90">
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
