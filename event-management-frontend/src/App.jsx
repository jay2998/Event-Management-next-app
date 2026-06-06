import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Bookings from './pages/Bookings.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DashboardLayout from './pages/DashboardLayout.jsx'
import AccessControl from './pages/dashboard/AccessControl.jsx'
import DashboardBookings from './pages/dashboard/Bookings.jsx'
import Catering from './pages/dashboard/Catering.jsx'
import Halls from './pages/dashboard/Halls.jsx'
import Rentals from './pages/dashboard/Rentals.jsx'
import Users from './pages/dashboard/Users.jsx'
import Vehicles from './pages/dashboard/Vehicles.jsx'
import Enquiry from './pages/Enquiry.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/enquiry" element={<Enquiry />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="admin/access-control" element={<AccessControl />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="catering" element={<Catering />} />
        <Route path="halls" element={<Halls />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="users" element={<Users />} />
        <Route path="vehicles" element={<Vehicles />} />
      </Route>
    </Routes>
  )
}
