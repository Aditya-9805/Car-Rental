import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'

import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'

import OwnerLayout from './pages/owner/OwnerLayout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {

  const { token } = useAppContext();

  if (!token) {

    return <Navigate to="/" replace />;

  }

  return children;
};

// Owner Route wrapper
const OwnerRoute = ({ children }) => {

  const { token } = useAppContext();

  if (!token) {

    return <Navigate to="/" replace />;

  }

  return children;
};

function App() {

  const { showLogin } = useAppContext();

  return (

    <div className="min-h-screen flex flex-col bg-slate-950 text-white">

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          },
        }}
      />

      {showLogin && <LoginModal />}

      <Navbar />

      <main className="flex-1">

        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route
            path="/cars"
            element={<Cars />}
          />

          <Route
            path="/car-details/:id"
            element={<CarDetails />}
          />

          {/* Protected User Routes */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>

                <MyBookings />

              </ProtectedRoute>
            }
          />

          {/* Protected Owner Routes */}
          <Route
            path="/owner"
            element={
              <OwnerRoute>

                <OwnerLayout />

              </OwnerRoute>
            }
          >

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="add-car"
              element={<AddCar />}
            />

            <Route
              path="manage-cars"
              element={<ManageCars />}
            />

            <Route
              path="manage-bookings"
              element={<ManageBookings />}
            />

          </Route>

        </Routes>

      </main>

      <Footer />

    </div>
  )
}

export default App