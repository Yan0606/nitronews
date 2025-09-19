import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';
import AvatarUpload from './components/AvatarUpload';
import UserSuggestions from './components/UserSuggestions';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <div className="flex">
            <main className="flex-1">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/avatar" element={
                  <ProtectedRoute>
                    <AvatarUpload />
                  </ProtectedRoute>
                } />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <aside className="hidden lg:block w-80 p-4">
              <UserSuggestions />
            </aside>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
