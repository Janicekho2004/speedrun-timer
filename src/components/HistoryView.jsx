import { NavLink } from "react-router-dom"
import RunHistoryItem from "./RunHistoryItem"

function HistoryView() {
  const runs = [
    {
      game: "Elden Ring",
      category: "Any%",
      date: "Oct 24, 2023",
      time: "59:12.44",
      status: "PB",
    },
    {
      game: "Hollow Knight",
      category: "100%",
      date: "Oct 22, 2023",
      time: "1:42:15.89",
    },
    {
      game: "Sekiro",
      category: "Glitchless",
      date: "Oct 20, 2023",
      time: "1:15:02.12",
    },
    {
      game: "Elden Ring",
      category: "Any%",
      date: "Oct 19, 2023",
      time: "42:11.00",
      status: "Reset",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">

      {/* Top Bar */}
      <header className="h-14 border-b border-[#424754]
      flex items-center justify-between px-4">

        <button className="text-xl text-[#adc6ff]">
          ☰
        </button>

        <h1 className="text-2xl font-bold">
          Run History
        </h1>

        <button className="text-xl text-[#adc6ff]">
          ⚙
        </button>

      </header>

      {/* Main Content */}
      <main className="p-4 pb-24">

        {/* Filter Bar */}
        <div className="flex justify-between items-center
        bg-[#131b2e]
        border border-[#424754]/30
        rounded-lg p-3 mb-4
        text-sm text-[#c2c6d6]">

          <div className="flex gap-2 items-center">
            <span>☷</span>
            <span>All Games</span>
          </div>

          <div className="flex gap-2 items-center">
            <span>Recent</span>
            <span>⇅</span>
          </div>

        </div>

        {/* History List */}
        <div className="space-y-3">
          {runs.map((run, index) => (
            <RunHistoryItem
              key={index}
              {...run}
            />
          ))}
        </div>

      </main>

      {/* Bottom Navigation */}
    <nav
        className="fixed bottom-0 left-0 right-0
        bg-[#171f33]
        border-t border-[#424754]
        flex justify-around py-2"
    >
        <NavLink
            to="/"
            className="flex flex-col items-center text-[#c2c6d6]"
        >
            <span className="text-xl">◷</span>
            <span className="text-xs mt-1">Timer</span>
        </NavLink>

        <NavLink
            to="/history"
            className="flex flex-col items-center text-[#4edea3]"
        >
            <span className="text-xl">↻</span>
            <span className="text-xs mt-1">History</span>
        </NavLink>
    </nav>

    </div>
  )
}

export default HistoryView