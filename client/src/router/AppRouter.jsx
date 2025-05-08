import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home/Home'
import MovieDetails from '../pages/MovieDetails'
import Search from '../pages/Search'
import Favorites from '../pages/Favorites'
import AdminPanel from '../pages/AdminPanel'
import AuthPage from '../pages/AuthPage'
import NotFound from '../pages/NotFound'
import Schedule from "../pages/Shedule/Schedule";
import SeatSelection from "../pages/Seats/SeatSelection";
import PrivateRoute from '../components/PrivateRoute'

const AppRouter = () => (
  <Routes>
    {/* PUBLIC */}
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetails />} />
    <Route path="/search" element={<Search />} />
    <Route path="/favorites" element={<Favorites />} />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/seats/:sessionId/:time" element={<SeatSelection />} />

    {/* AUTH */}
    <Route path="/login" element={<AuthPage />} />

    {/* PRIVATE */}
    <Route 
      path="/admin" 
      element={
        <PrivateRoute>
          <AdminPanel />
        </PrivateRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRouter
