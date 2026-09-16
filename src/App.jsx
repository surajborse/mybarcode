import { Link, Route, Routes } from 'react-router-dom'
import Labels from './Labels'
import Scanner from './Scanner'
import './nav.css'

export default function App() {
  return (
    <>
      <nav className="app-nav">
        <Link to="/scan">Scanner</Link>
        <Link to="/labels">Labels</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/labels" element={<Labels />} />
      </Routes>
    </>
  )
}
