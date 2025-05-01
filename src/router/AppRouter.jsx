import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home/Home'
import MovieDetails from '../pages/MovieDetails'
import Search from '../pages/Search'
import Schedule from '../pages/Schedule'
import Favorites from '../pages/Favorites'
import AdminPanel from '../pages/AdminPanel'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import PrivateRoute from '../components/PrivateRoute'

const AppRouter = () => (
  <Routes>
    {/* PUBLIC */}
    <Route path="/" element={<Home />} />
    <Route path="/movie/:id" element={<MovieDetails />} />
    <Route path="/search" element={<Search />} />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/favorites" element={<Favorites />} />

    {/* AUTH */}
    <Route path="/login" element={<Login />} />

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
