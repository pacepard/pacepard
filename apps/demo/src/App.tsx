import { Routes, Route, Link } from 'react-router-dom'
import { SimpleEditor } from '@/simple/simple-editor'
import { NotionEditor } from '@/notion-like/notion-like-editor'
import './App.css'

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Pacepard Editor</h1>
      <p>Choose an editor to get started:</p>
      <div className="button-group">
        <Link to="/editor" className="nav-button">
          Simple Editor
        </Link>
        <Link to="/notion" className="nav-button">
          Notion-like Editor
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/editor" element={<SimpleEditor />} />
      <Route path="/notion" element={<NotionEditor room="default" />} />
    </Routes>
  )
}

export default App
