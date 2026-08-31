function TimerView() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col">

      {/* Top Bar */}
      <header className="h-14 border-b border-[#424754] flex items-center justify-between px-4">
        <button className="text-[#adc6ff] text-xl">
          ☰
        </button>

        <h1 className="text-xl font-bold">
          Elden Ring - Any%
        </h1>

        <button className="text-[#adc6ff] text-xl">
          ⚙
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">

        {/* Timer */}
        <div className="flex-1 flex flex-col items-center justify-center">

          <div className="font-mono text-5xl md:text-6xl font-bold text-[#4edea3] tracking-tight">
            00:42:15.82
          </div>

          {/* Current split */}
          <h2 className="text-xl font-semibold mt-4">
            Godrick the Grafted
          </h2>

          {/* PB comparison */}
          <div className="mt-3 bg-[#4edea3]/10 border border-[#4edea3]/20 px-3 py-1 rounded-full">
            <span className="font-mono text-[#4edea3]">
              ↓ -1.24s
            </span>
          </div>

        </div>

        {/* Controls */}
        <div className="w-full max-w-sm flex flex-col gap-4">

          <button className="w-full bg-[#4d8eff] text-[#00285d] font-semibold text-lg py-5 rounded-lg hover:bg-[#adc6ff] transition">
            SPLIT
          </button>

          <div className="flex gap-4">

            <button className="flex-1 bg-[#2d3449] border border-[#424754] py-3 rounded-lg hover:bg-[#31394d] transition">
              ⏸ Pause
            </button>

            <button className="flex-1 bg-[#2d3449] border border-[#424754] py-3 rounded-lg hover:bg-[#31394d] transition">
              ↻ Reset
            </button>

          </div>

        </div>

        {/* Personal Best */}
        <div className="mt-8 mb-4 text-[#c2c6d6] font-mono">
          🏆 Personal Best: 58:24.10
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#171f33] border-t border-[#424754] flex justify-around py-2">

        <button className="flex flex-col items-center text-[#4edea3]">
          <span className="text-xl">◷</span>
          <span className="text-xs mt-1">Timer</span>
        </button>

        <button className="flex flex-col items-center text-[#c2c6d6]">
          <span className="text-xl">↻</span>
          <span className="text-xs mt-1">History</span>
        </button>

      </nav>

    </div>
  )
}

export default TimerView