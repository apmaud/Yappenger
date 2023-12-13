import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatsPage from './pages/ChatsPage'
import { Box } from '@mui/material'
import Notification from './components/misc/Notification'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      className='app'
    >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chats" element={<ChatsPage />} />
          </Routes>
          <Notification />
    </div>
  )
}

export default App
