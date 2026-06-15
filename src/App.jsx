import React from 'react';
import EmpireBar from './components/EmpireBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GameGrid from './components/GameGrid';
import GamePage from './components/GamePage';
import GamePlayer from './pages/GamePlayer';
import MyLibrary from './pages/MyLibrary';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Games from './pages/Games';
import About from './pages/About';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <EmpireBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <GameGrid />
            </>
          } />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/play/:id" element={<GamePlayer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/games" element={<Games />} />
          <Route path="/categories" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
