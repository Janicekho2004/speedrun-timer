import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"

function TimerView() {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [splits, setSplits] = useState([])

  const startTimeRef = useRef(0)
  const previousElapsedRef = useRef(0)
  const animationRef = useRef(null)

  // Timer loop
  useEffect(() => {
    if (!isRunning) return

    const updateTimer = (currentTime) => {
      const newElapsed =
        previousElapsedRef.current +
        (currentTime - startTimeRef.current)

      setElapsedTime(newElapsed)

      animationRef.current = requestAnimationFrame(updateTimer)
    }

    animationRef.current = requestAnimationFrame(updateTimer)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning])

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

    const newSplit = {
      number: splits.length + 1,
      time: elapsedTime,
    }

    setSplits([...splits, newSplit])
  }

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

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pb-24">

        {/* Timer Area */}
        <div className="flex-1 flex flex-col items-center justify-center">

          <div className="font-mono text-5xl md:text-6xl font-bold text-[#4edea3] tracking-tight">
            {formatTime(elapsedTime)}
          </div>

          <h2 className="text-xl font-semibold mt-5">
            Godrick the Grafted
          </h2>

          <div className="mt-3 bg-[#4edea3]/10 border border-[#4edea3]/20 px-3 py-1 rounded-full">
            <span className="font-mono text-[#4edea3]">
              ↓ -1.24s
            </span>
          </div>

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
                    Split {split.number}
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
              className="w-full bg-[#4d8eff] text-[#00285d]
              font-semibold text-lg py-5 rounded-lg
              hover:bg-[#adc6ff] transition"
            >
              SPLIT
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
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex-1 bg-[#2d3449]
                  border border-[#424754]
                  py-3 rounded-lg
                  hover:bg-[#31394d] transition"
                >
                  ▶ Resume
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex-1 bg-[#2d3449]
                border border-[#424754]
                py-3 rounded-lg
                hover:bg-[#31394d] transition"
              >
                ↻ Reset
              </button>

            </div>
          )}

        </div>

        <div className="mt-8 mb-4 text-[#c2c6d6] font-mono">
          🏆 Personal Best: 58:24.10
        </div>

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#171f33] border-t border-[#424754] flex justify-around py-2">

        <NavLink
          to="/"
          className="flex flex-col items-center text-[#4edea3]"
        >
          <span className="text-xl">◷</span>
          <span className="text-xs mt-1">Timer</span>
        </NavLink>

        <NavLink
          to="/history"
          className="flex flex-col items-center text-[#c2c6d6]"
        >
          <span className="text-xl">↻</span>
          <span className="text-xs mt-1">History</span>
        </NavLink>

      </nav>

    </div>
  )
}

export default TimerView