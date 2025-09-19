import React, { useState, useEffect, useRef } from 'react';
import { followAPI } from '../services/api';
import { User } from '../types';
import { getAvatarForContext } from '../utils/avatarUtils';

interface UserSearchProps {
  onUserSelect?: (user: User) => void;
  placeholder?: string;
  className?: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ 
  onUserSelect, 
  placeholder = "Buscar usuários...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await followAPI.searchUsers(query);
      setResults(response.data.users);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      setFollowLoading(prev => ({ ...prev, [userId]: true }));
      await followAPI.toggleFollow(userId);
      
      // Remove from results after following
      setResults(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUserClick = (user: User) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setQuery('');
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pl-9 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              {query.length < 2 ? 'Digite pelo menos 2 caracteres' : 'Nenhum usuário encontrado'}
            </div>
          ) : (
            <div className="py-1">
              {results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={getAvatarForContext('header', user.avatar_url, user.gravatar, user.name, user.email)}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name}
                      </p>
                      {user.username && (
                        <p className="text-xs text-gray-400 truncate">
                          @{user.username}
                        </p>
                      )}
                      {user.bio && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleFollowToggle(user.id, e)}
                    disabled={followLoading[user.id]}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {followLoading[user.id] ? '...' : 'Seguir'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
