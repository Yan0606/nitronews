import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserSearch from './UserSearch';
import { getAvatarForContext } from '../utils/avatarUtils';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon"></div>
          <h1 className="logo-text">Microblog</h1>
        </Link>
        
        {user && (
          <div className="user-menu">
            <div className="flex items-center space-x-3">
              <UserSearch 
                className="hidden md:block w-56"
                placeholder="Buscar usuários..."
              />
              <Link
                to="/avatar"
                className="btn btn-ghost btn-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Avatar
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
              >
                Logout
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={getAvatarForContext('header', user.avatar_url, user.gravatar, user.name, user.email)}
                  alt={user.name}
                  className="header-avatar hover:border-gray-400 transition-colors duration-200"
                />
                <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
