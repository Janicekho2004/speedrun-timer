import { Routes, Route } from "react-router-dom"
import TimerView from "./components/TimerView"
import HistoryView from "./components/HistoryView"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TimerView />} />
      <Route path="/history" element={<HistoryView />} />
    </Routes>
  )
}

export default App