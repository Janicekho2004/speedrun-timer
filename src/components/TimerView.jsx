import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

function TimerView() {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [splits, setSplits] = useState([])
    const [pbSplits, setPbSplits] = useState([])
    const [personalBest, setPersonalBest] = useState(null)

    const startTimeRef = useRef(0)
    const previousElapsedRef = useRef(0)
    const animationRef = useRef(null)

    const navigate = useNavigate()

    const [game, setGame] = useState("Elden Ring")
    const [category, setCategory] = useState("Any%")
    const gameOptions = {
        "Elden Ring": ["Any%", "All Remembrances", "Glitchless"],
        "Hollow Knight": ["Any%", "100%", "No Major Glitches"],
        "Sekiro": ["Any%", "Shura", "Glitchless"],
    }

    const splitOptions = {
        "Elden Ring": {
            "Any%": [
            "Margit",
            "Godrick the Grafted",
            "Red Wolf",
            "Morgott",
            "Fire Giant",
            "Maliketh",
            "Final Boss",
            ],

            "All Remembrances": [
            "Godrick",
            "Rennala",
            "Radahn",
            "Rykard",
            "Morgott",
            "Fire Giant",
            "Maliketh",
            "Final Boss",
            ],

            "Glitchless": [
            "Margit",
            "Godrick",
            "Rennala",
            "Morgott",
            "Fire Giant",
            "Maliketh",
            "Final Boss",
            ],
        },

        "Hollow Knight": {
            "Any%": [
            "False Knight",
            "Hornet",
            "Mantis Claw",
            "Watcher Knights",
            "The Hollow Knight",
            ],

            "100%": [
            "Greenpath",
            "City of Tears",
            "Crystal Peak",
            "Deepnest",
            "Dreamers",
            "Final Boss",
            ],

            "No Major Glitches": [
            "False Knight",
            "Hornet",
            "Mantis Claw",
            "Dreamers",
            "Final Boss",
            ],
        },

        "Sekiro": {
            "Any%": [
            "Gyoubu",
            "Genichiro",
            "Guardian Ape",
            "Corrupted Monk",
            "Divine Dragon",
            "Final Boss",
            ],

            "Shura": [
            "Gyoubu",
            "Genichiro",
            "Guardian Ape",
            "Emma",
            "Isshin",
            ],

            "Glitchless": [
            "Gyoubu",
            "Genichiro",
            "Guardian Ape",
            "Divine Dragon",
            "Final Boss",
            ],
        },
    }

    const currentSplitIndex = splits.length

    const pbSplitTime =
        pbSplits[currentSplitIndex]?.time ??
        (currentSplitIndex === 0 ? personalBest : null)
    const comparison =
        pbSplitTime !== null
            ? elapsedTime - pbSplitTime
            : null

    const formatDifference = (milliseconds) => {
        const seconds = Math.abs(milliseconds) / 1000

        const sign =
            milliseconds < 0
            ? "-"
            : milliseconds > 0
            ? "+"
            : ""

        return `${sign}${seconds.toFixed(2)}s`
    }

    const handleFinish = () => {
        if (!hasStarted) return

        const finalTime = isRunning
        ? previousElapsedRef.current +
            (performance.now() - startTimeRef.current)
        : elapsedTime

        setIsRunning(false)

        const existingRuns =
        JSON.parse(localStorage.getItem("speedrunRuns")) || []

        const finalSplits = [
            ...splits,
            {
                number: splits.length + 1,
                time: finalTime,
            },
        ]

        const newRun = {
            id: Date.now(),
            game,
            category,
            time: finalTime,
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            status: null,
            splits: finalSplits,
        }

        // Put newest run together with previous runs
        const allRuns = [newRun, ...existingRuns]

        // Only compare completed runs from the same game/category
        const comparableRuns = allRuns.filter(
            (run) =>
                run.game === game &&
                run.category === category &&
                run.status !== "Reset" &&
                typeof run.time === "number"
        )

        // Find the single fastest run
        const fastestRun = comparableRuns.reduce(
            (best, run) => {
                if (!best || run.time < best.time) {
                return run
                }

                return best
            },
            null
        )

        // Remove old PB badges and give PB only to fastest run
        const updatedRuns = allRuns.map((run) => {
            if (
                run.game === game &&
                run.category === category &&
                run.status !== "Reset"
            ) {
                return {
                ...run,
                status:
                    run.id === fastestRun?.id
                    ? "PB"
                    : null,
                }
            }

            return run
        })

        localStorage.setItem(
            "speedrunRuns",
            JSON.stringify(updatedRuns)
        )

        setPersonalBest(fastestRun?.time ?? null)
        setPbSplits(fastestRun?.splits || [])

        navigate("/history")
    }

    
    // Timer loop
    useEffect(() => {
        if (!isRunning) return

        const updateTimer = (currentTime) => {
            const newElapsed =
            previousElapsedRef.current +
            (currentTime - startTimeRef.current)

            setElapsedTime(newElapsed)

            animationRef.current =
            requestAnimationFrame(updateTimer)
        }

        animationRef.current =
            requestAnimationFrame(updateTimer)

        return () => {
            if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isRunning])


    // Load Personal Best
    useEffect(() => {
        const savedRuns =
            JSON.parse(localStorage.getItem("speedrunRuns")) || []

        const completedRuns = savedRuns.filter(
            (run) =>
            run.game === game &&
            run.category === category &&
            run.status !== "Reset" &&
            typeof run.time === "number"
        )

        if (completedRuns.length === 0) {
            setPersonalBest(null)
            setPbSplits([])
            return
        }

        const fastestRun = completedRuns.reduce(
            (best, run) => {
            if (!best || run.time < best.time) {
                return run
            }

                return best
            },
            null
        )

        setPersonalBest(fastestRun.time)
        setPbSplits(fastestRun.splits || [])
    }, [game, category])

    // Format: 00:42:15.82
    const formatTime = (milliseconds) => {
        const totalCentiseconds = Math.floor(milliseconds / 10)

        const centiseconds = totalCentiseconds % 100
        const totalSeconds = Math.floor(totalCentiseconds / 100)

        const seconds = totalSeconds % 60
        const totalMinutes = Math.floor(totalSeconds / 60)

        const minutes = totalMinutes % 60
        const hours = Math.floor(totalMinutes / 60)

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(
            2,
            "0"
        )}`
    }

    const handleStart = () => {
        startTimeRef.current = performance.now()
        previousElapsedRef.current = elapsedTime

        setHasStarted(true)
        setIsRunning(true)
    }

    const handlePause = () => {
        previousElapsedRef.current = elapsedTime
        setIsRunning(false)
    }

    const handleReset = () => {
        setIsRunning(false)
        setHasStarted(false)
        setElapsedTime(0)
        setSplits([])

        previousElapsedRef.current = 0
    }

    const handleSplit = () => {
        if (!hasStarted) return

        const splitIndex = splits.length

        if (splitIndex >= splitNames.length) {
            return
        }

        const newSplit = {
            number: splitIndex + 1,
            name: splitNames[splitIndex],
            time: elapsedTime,
        }

        setSplits([...splits, newSplit])
    }

    const handleGameChange = (event) => {
        const selectedGame = event.target.value

        setGame(selectedGame)
        setCategory(gameOptions[selectedGame][0])
    }

    const splitNames =
    splitOptions[game]?.[category] || []

    const currentSplitName =
        splitNames[currentSplitIndex] || "All Splits Complete"

    return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col">

        {/* Top Bar */}
        <header className="h-14 border-b border-[#424754] flex items-center justify-between px-4">
            <button className="text-[#adc6ff] text-xl">
                {"\u2630"}
            </button>

            <h1 className="text-lg font-bold truncate max-w-[220px] text-center">
                {game} - {category}
            </h1>

            <button className="text-[#adc6ff] text-xl">
                {"\u2699"}
            </button>
        </header>

        {!hasStarted && (
        <div className="px-4 py-3 border-b border-[#424754] bg-[#131b2e]">
            <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-3">

            {/* Game */}
            <select
                value={game}
                onChange={handleGameChange}
                className="
                flex-1
                bg-[#1E293B]
                border border-[#424754]
                text-[#dae2fd]
                rounded-lg
                px-3 py-2
                outline-none
                "
            >
                {Object.keys(gameOptions).map((gameName) => (
                <option
                    key={gameName}
                    value={gameName}
                >
                    {gameName}
                </option>
                ))}
            </select>

            {/* Category */}
            <select
                value={category}
                onChange={(event) =>
                setCategory(event.target.value)
                }
                className="
                flex-1
                bg-[#1E293B]
                border border-[#424754]
                text-[#dae2fd]
                rounded-lg
                px-3 py-2
                outline-none
                "
            >
                {gameOptions[game].map((categoryName) => (
                <option
                    key={categoryName}
                    value={categoryName}
                >
                    {categoryName}
                </option>
                ))}
            </select>

            </div>
        </div>
        )}

        {/* Main */}
        <main className="flex-1 flex flex-col items-center px-4 pb-24">

        {/* Timer Area */}
        <div className="flex-1 flex flex-col items-center justify-center">

            <div className="font-mono text-5xl md:text-6xl font-bold text-[#4edea3] tracking-tight">
                {formatTime(elapsedTime)}
            </div>

            <h2 className="text-xl font-semibold mt-5">
                {currentSplitName}
            </h2>

            {hasStarted && comparison !== null && (
                <div
                    className={`mt-3 px-3 py-1 rounded-full border ${
                    comparison <= 0
                        ? "bg-[#4edea3]/10 border-[#4edea3]/20"
                        : "bg-[#ffb4ab]/10 border-[#ffb4ab]/20"
                    }`}
                >
                    <span
                        className={`font-mono ${
                            comparison <= 0
                            ? "text-[#4edea3]"
                            : "text-[#ffb4ab]"
                        }`}
                    >
                        {comparison <= 0 ? "\u2193" : "\u2191"}{" "}
                        {formatDifference(comparison)}
                    </span>
                </div>
            )}

            {hasStarted && comparison === null && (
                <div className="mt-3 px-3 py-1 rounded-full border border-[#424754]">
                    <span className="font-mono text-[#8c909f]">
                        No PB comparison
                    </span>
                </div>
            )}

            {/* Splits */}
            {splits.length > 0 && (
            <div className="mt-6 w-full max-w-sm">
                <p className="text-sm text-[#8c909f] mb-2">
                Splits
                </p>

                {splits.map((split) => (
                <div
                    key={split.number}
                    className="flex justify-between border-b border-[#424754] py-2"
                >
                    <span>
                        {split.name || `Split ${split.number}`}
                    </span>

                    <span className="font-mono">
                        {formatTime(split.time)}
                    </span>
                </div>
                ))}
            </div>
            )}

        </div>

        {/* Controls */}
        <div className="w-full max-w-sm flex flex-col gap-4">

            {!hasStarted ? (
            <button
                onClick={handleStart}
                className="w-full bg-[#4d8eff] text-[#00285d]
                font-semibold text-lg py-5 rounded-lg
                hover:bg-[#adc6ff] transition"
            >
                START
            </button>
            ) : (
            <button
                onClick={handleSplit}
                disabled={splits.length >= splitNames.length}
                className={`
                    w-full font-semibold text-lg py-5 rounded-lg transition
                    ${
                    splits.length >= splitNames.length
                        ? "bg-[#2d3449] text-[#8c909f] cursor-not-allowed"
                        : "bg-[#4d8eff] text-[#00285d] hover:bg-[#adc6ff]"
                    }
                `}
                >
                {splits.length >= splitNames.length
                    ? "ALL SPLITS COMPLETE"
                    : "SPLIT"}
            </button>
            )}

            {hasStarted && (
            <div className="flex gap-4">

                {isRunning ? (
                <button
                    onClick={handlePause}
                    className="flex-1 bg-[#2d3449]
                    border border-[#424754]
                    py-3 rounded-lg
                    hover:bg-[#31394d] transition"
                >
                    {"\u23F8"} Pause
                </button>
                ) : (
                <button
                    onClick={handleStart}
                    className="flex-1 bg-[#2d3449]
                    border border-[#424754]
                    py-3 rounded-lg
                    hover:bg-[#31394d] transition"
                >
                    {"\u25B6"} Resume
                </button>
                )}

                <button
                    onClick={handleReset}
                    className="flex-1 bg-[#2d3449]
                    border border-[#424754]
                    py-3 rounded-lg
                    hover:bg-[#31394d] transition"
                >
                    {"\u21BB"} Reset
                </button>

            </div>
            )}

            {hasStarted && (
                <button
                    onClick={handleFinish}
                    className="
                    w-full
                    border border-[#4edea3]
                    text-[#4edea3]
                    font-semibold
                    py-3
                    rounded-lg
                    hover:bg-[#4edea3]/10
                    transition
                    "
                >
                    FINISH RUN
                </button>
            )}

        </div>

        <div className="mt-8 mb-4 text-[#c2c6d6] font-mono">
            {"\u{1F3C6}"} Personal Best:{" "}
            {personalBest !== null
                ? formatTime(personalBest)
                : "No PB yet"}
        </div>

        </main>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#171f33] border-t border-[#424754] flex justify-around py-2">

        <NavLink
            to="/"
            className="flex flex-col items-center text-[#4edea3]"
        >
            <span className="text-xl">{"\u25B7"}</span>
            <span className="text-xs mt-1">Timer</span>
        </NavLink>

        <NavLink
            to="/history"
            className="flex flex-col items-center text-[#c2c6d6]"
        >
            <span className="text-xl">{"\u21BB"}</span>
            <span className="text-xs mt-1">History</span>
        </NavLink>

        </nav>

    </div>
    )
}

export default TimerView
