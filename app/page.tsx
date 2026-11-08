export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-100 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Tailwind CSS v4 Aktif!
        </h1>
        <p className="text-slate-600 mb-6 text-sm">
          Styling berhasil dimuat via Turbopack tanpa perlu konfigurasi Vite atau PostCSS tambahan.
        </p>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-all duration-200">
          Mulai Coding
        </button>
      </div>
    </main>
  );
}
