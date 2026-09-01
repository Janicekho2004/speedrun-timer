import { NavLink, useNavigate, } from "react-router-dom"
import RunHistoryItem from "./RunHistoryItem"
import { useEffect, useState } from "react"

function HistoryView() {
    const navigate = useNavigate()

    const formatTime = (milliseconds) => {
        const totalCentiseconds = Math.floor(milliseconds / 10)

        const centiseconds = totalCentiseconds % 100
        const totalSeconds = Math.floor(totalCentiseconds / 100)

        const seconds = totalSeconds % 60
        const totalMinutes = Math.floor(totalSeconds / 60)

        const minutes = totalMinutes % 60
        const hours = Math.floor(totalMinutes / 60)

        if (hours > 0) {
            return `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
            )}.${String(centiseconds).padStart(2, "0")}`
        }

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}.${String(centiseconds).padStart(
            2,
            "0"
        )}`
    }

    const [runs, setRuns] = useState([])
    const [selectedGame, setSelectedGame] = useState("All Games")
    const [sortOrder, setSortOrder] = useState("recent")

    useEffect(() => {
        const savedRuns =
            JSON.parse(localStorage.getItem("speedrunRuns")) || []

        setRuns(savedRuns)
    }, [])

    const games = [
        "All Games",
        ...new Set(runs.map((run) => run.game)),
    ]

    const displayedRuns = runs
    .filter((run) => {
        if (selectedGame === "All Games") {
        return true
        }

        return run.game === selectedGame
    })
    .sort((a, b) => {
        if (sortOrder === "recent") {
        return b.id - a.id
        }

        return a.id - b.id
    })

    const getPersonalBestId = (game, category) => {
        const matchingRuns = runs.filter(
            (run) =>
                run.game === game &&
                run.category === category &&
                run.status !== "Reset" &&
                typeof run.time === "number"
            )

            if (matchingRuns.length === 0) {
                return null
            }

            const fastestRun = matchingRuns.reduce((best, run) => {
                if (!best || run.time < best.time) {
                    return run
            }

            return best
        }, null)

        return fastestRun.id
    }

    const handleDeleteRun = (id) => {
        const confirmed = window.confirm(
            "Delete this run?"
        )

        if (!confirmed) return

        const updatedRuns = runs.filter(
            (run) => run.id !== id
        )

        setRuns(updatedRuns)

        localStorage.setItem(
            "speedrunRuns",
            JSON.stringify(updatedRuns)
        )
    }

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

        {/* Filter / Sort */}
        <div
        className="
            grid grid-cols-2 gap-3
            bg-[#131b2e]
            border border-[#424754]/30
            rounded-lg p-3 mb-4
        "
        >
        {/* Game Filter */}
        <select
            value={selectedGame}
            onChange={(event) =>
            setSelectedGame(event.target.value)
            }
            className="
            w-full min-w-0
            bg-[#1E293B]
            border border-[#424754]
            text-[#dae2fd]
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            "
        >
            {games.map((gameName) => (
            <option key={gameName} value={gameName}>
                {gameName}
            </option>
            ))}
        </select>

        {/* Sort */}
        <select
            value={sortOrder}
            onChange={(event) =>
            setSortOrder(event.target.value)
            }
            className="
            w-full min-w-0
            bg-[#1E293B]
            border border-[#424754]
            text-[#dae2fd]
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            "
        >
            <option value="recent">
            Recent
            </option>

            <option value="oldest">
            Oldest
            </option>
        </select>
        </div>

        </div>

        {/* History List */}
        <div className="space-y-3">

            {displayedRuns.length === 0 ? (
                <div className="text-center text-[#8c909f] mt-20">
                <p className="text-lg">No runs yet.</p>

                <p className="text-sm mt-2">
                    Finish your first speedrun to see it here.
                </p>
                </div>
            ) : (
                displayedRuns.map((run) => {
                    const personalBestId = getPersonalBestId(
                        run.game,
                        run.category
                    )

                    const status =
                        run.status === "Reset"
                        ? "Reset"
                        : run.id === personalBestId
                        ? "PB"
                        : null

                    return (
                        <RunHistoryItem
                        key={run.id}
                        game={run.game}
                        category={run.category}
                        date={run.date}
                        time={formatTime(run.time)}
                        status={status}
                        onDelete={() => handleDeleteRun(run.id)}
                        onClick={() => navigate(`/history/${run.id}`)}
                        />
                    )
                })
        )}

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
