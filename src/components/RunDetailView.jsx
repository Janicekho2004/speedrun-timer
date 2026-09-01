import { NavLink, useNavigate, useParams } from "react-router-dom"

function RunDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const runs =
    JSON.parse(localStorage.getItem("speedrunRuns")) || []

  const run = runs.find(
    (run) => String(run.id) === id
  )

  const formatTime = (milliseconds) => {
    const totalCentiseconds = Math.floor(milliseconds / 10)

    const centiseconds = totalCentiseconds % 100
    const totalSeconds = Math.floor(totalCentiseconds / 100)

    const seconds = totalSeconds % 60
    const totalMinutes = Math.floor(totalSeconds / 60)

    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60)

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(centiseconds).padStart(2, "0")}`
  }

    const getSegmentTime = (splits, index) => {
        if (index === 0) {
            return splits[index].time
        }

        return splits[index].time - splits[index - 1].time
    }

  if (!run) {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-center">
        <p className="text-lg">
          Run not found.
        </p>

        <button
          onClick={() => navigate("/history")}
          className="mt-4 text-[#4edea3]"
        >
          Back to History
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">

      {/* Header */}
      <header className="h-14 border-b border-[#424754] flex items-center justify-between px-4">

        <button
          onClick={() => navigate("/history")}
          className="text-xl text-[#adc6ff]"
        >
          ←
        </button>

        <h1 className="text-lg font-bold">
          Run Details
        </h1>

        <div className="w-6" />

      </header>

      <main className="p-4 pb-24">

        {/* Run Summary */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5">

          <div className="flex justify-between items-start">

            <div>
              <h2 className="text-2xl font-bold">
                {run.game}
              </h2>

              <p className="text-[#c2c6d6] mt-1">
                {run.category}
              </p>
            </div>

            {run.status === "PB" && (
              <span className="bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30 px-2 py-1 rounded-full text-xs font-semibold">
                PB
              </span>
            )}

          </div>

          <div className="mt-6">

            <p className="text-xs text-[#8c909f]">
              FINAL TIME
            </p>

            <p className="font-mono text-3xl font-bold text-[#4edea3] mt-1">
              {formatTime(run.time)}
            </p>

          </div>

          <p className="text-sm text-[#8c909f] mt-4">
            {run.date}
          </p>

        </div>

        {/* Splits */}
        <div className="mt-6">

          <h3 className="text-lg font-semibold mb-3">
            Splits
          </h3>

          {!run.splits || run.splits.length === 0 ? (
            <div className="text-center text-[#8c909f] py-10">
              No splits recorded for this run.
            </div>
          ) : (
            <div className="space-y-2">

              <div className="flex justify-between text-xs text-[#8c909f] mb-2 px-1">
                <span>Split</span>

                <div className="text-right">
                  <span>Overall / Segment</span>
                </div>
              </div>

        {run.splits.map((split, index) => {
            const segmentTime = getSegmentTime(
                run.splits,
                index
            )

            return (
                <div
                key={split.number}
                className="
                    bg-[#1E293B]
                    border border-[#334155]
                    rounded-lg
                    px-4 py-3
                    flex justify-between
                    items-center
                "
                >
                {/* Split name */}
                <div>
                    <p className="text-[#dae2fd] font-medium">
                    {split.name || `Split ${split.number}`}
                    </p>

                    <p className="text-xs text-[#8c909f] mt-1">
                    Segment
                    </p>
                </div>

                {/* Times */}
                <div className="text-right">

                    <p className="font-mono font-semibold text-[#dae2fd]">
                        {formatTime(split.time)}
                    </p>

                    <p className="font-mono text-sm text-[#4edea3] mt-1">
                        {formatTime(segmentTime)}
                    </p>

                </div>
            </div>
            )
        })}

            </div>
          )}

        </div>

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#171f33] border-t border-[#424754] flex justify-around py-2">

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

export default RunDetailView
