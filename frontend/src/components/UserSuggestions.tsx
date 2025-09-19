import React, { useState } from 'react';
import { followAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarForContext } from '../utils/avatarUtils';
import { useSuggestions } from '../hooks/useSuggestions';

interface UserSuggestionsProps {
  className?: string;
}

const UserSuggestions: React.FC<UserSuggestionsProps> = ({ className = '' }) => {
  const { user: currentUser } = useAuth();
  const { suggestions, loading, error, refetch } = useSuggestions();
  const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});

  const handleFollowToggle = async (userId: number) => {
    try {
      setFollowLoading(prev => ({ ...prev, [userId]: true }));
      const response = await followAPI.toggleFollow(userId);
      
      // Remove from suggestions if now following
      if (response.data.is_following) {
        // Refresh suggestions to get updated list
        refetch();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Não renderizar se não há usuário logado
  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Sugestões</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Sugestões</h3>
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Sugestões</h3>
        <p className="text-gray-400 text-sm">Nenhuma sugestão no momento</p>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Sugestões</h3>
      <div className="space-y-3">
        {suggestions.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
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
                {user.followers_count && user.followers_count > 0 && (
                  <p className="text-xs text-gray-500">
                    {user.followers_count} seguidor{user.followers_count !== 1 ? 'es' : ''}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleFollowToggle(user.id)}
              disabled={followLoading[user.id]}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {followLoading[user.id] ? '...' : 'Seguir'}
            </button>
          </div>
        ))}
      </div>
      
      {suggestions.length > 5 && (
        <button
          onClick={refetch}
          className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Ver mais sugestões
        </button>
      )}
    </div>
  );
};

export default UserSuggestions;
