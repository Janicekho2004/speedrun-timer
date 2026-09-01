import { Routes, Route } from "react-router-dom"
import TimerView from "./components/TimerView"
import HistoryView from "./components/HistoryView"
import RunDetailView from "./components/RunDetailView"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TimerView />} />
      <Route path="/history" element={<HistoryView />} />
      <Route path="/history/:id"element={<RunDetailView />} />
    </Routes>
  )
}

export default App