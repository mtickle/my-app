import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const appName = import.meta.env.VITE_APP_NAME || "Vite + React";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
      {/* Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">

        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500 blur-3xl opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-violet-500 blur-3xl opacity-10 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-slate-800 rounded-lg mb-6 border border-slate-700">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
            <span className="text-xs font-mono text-slate-400">SYSTEM ONLINE</span>
          </div>

          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            {appName}
          </h1>

          <p className="text-slate-400 mb-8 text-lg">
            Zero config. Maximum speed. <br />
            <span className="text-sm opacity-50">Tailwind v4 + Vite + GitHub Actions</span>
          </p>

          <button
            onClick={() => setCount(c => c + 1)}
            className="group w-full py-3 px-6 bg-white text-slate-950 font-bold rounded-lg transition-all hover:bg-cyan-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            Deployments Count: {count}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;