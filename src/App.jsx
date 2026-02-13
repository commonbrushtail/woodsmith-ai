import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LineFAB from './components/LineFAB'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BranchPage from './pages/BranchPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-white w-full min-h-screen">
        <TopBar />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/branches" element={<BranchPage />} />
        </Routes>
        <Footer />
        <LineFAB />
      </div>
    </BrowserRouter>
  )
}
