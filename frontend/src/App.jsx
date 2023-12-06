import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { Box } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div
      className='app'
    >
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
    </div>
  )
}

export default App
