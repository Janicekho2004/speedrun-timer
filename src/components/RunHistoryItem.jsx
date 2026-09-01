function RunHistoryItem({
  game,
  category,
  date,
  time,
  status,
  onDelete
}) {
  const isPB = status === "PB"
  const isReset = status === "Reset"

  return (
    <div
      className={`bg-[#1E293B] border border-[#334155] rounded-xl p-4
      flex justify-between items-center
      hover:bg-[#2d3449] transition cursor-pointer
      ${isReset ? "opacity-75" : ""}`}
    >
      {/* Left side */}
      <div className="flex flex-col">

        <div className="flex items-center gap-3 mb-2">

          <span className="text-xl font-semibold text-[#dae2fd]">
            {game}
          </span>

          {isPB && (
            <span className="bg-[#00a572]/20 text-[#4edea3]
            border border-[#4edea3]/30
            px-2 py-0.5 rounded-full text-xs font-semibold">
              PB
            </span>
          )}

          {isReset && (
            <span className="bg-[#93000a]/20 text-[#ffb4ab]
            border border-[#ffb4ab]/30
            px-2 py-0.5 rounded-full text-xs font-semibold">
              Reset
            </span>
          )}

        </div>

        <span className="text-[#c2c6d6]">
          {category}
        </span>

        <span className="text-xs text-[#8c909f] mt-2">
          {date}
        </span>

      </div>

      {/* Right side */}
      <div className="text-right">

        <span
          className={`font-mono font-bold
          ${
            isPB
              ? "text-[#4edea3]"
              : isReset
              ? "text-[#ffb4ab]"
              : "text-[#dae2fd]"
          }`}
        >
          {time}
        </span>

        <div className="text-[#8c909f] mt-2">
          {"\u203A"}
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation()
            onDelete?.()
          }}
          className="mt-2 text-xs text-[#ffb4ab] hover:text-red-400 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default RunHistoryItem
