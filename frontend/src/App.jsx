import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Customers from './pages/Customers';
import Login from './pages/Login';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;