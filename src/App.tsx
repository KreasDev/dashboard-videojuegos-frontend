import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { VideoGamesProvider } from './context/ItemsContext'
import AddItemPage from './pages/AddItemPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <VideoGamesProvider>
              <Outlet />
            </VideoGamesProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/nuevo" element={<AddItemPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
