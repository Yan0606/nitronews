import React, { useState, useEffect } from 'react';
import { followAPI } from '../services/api';
import { User } from '../types';

interface FollowListProps {
  userId: number;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowList: React.FC<FollowListProps> = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchUsers();
  }, [userId, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = type === 'followers' 
        ? await followAPI.getFollowers(userId)
        : await followAPI.getFollowing(userId);
      
      setUsers(response.data.data);
    } catch (error: any) {
      setError('Erro ao carregar lista');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (targetUserId: number) => {
    try {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: true }));
      const response = await followAPI.toggleFollow(targetUserId);
      
      // Update the user in the list
      setUsers(prev => 
        prev.map(user => 
          user.id === targetUserId 
            ? { 
                ...user, 
                followers_count: response.data.is_following 
                  ? (user.followers_count || 0) + 1
                  : (user.followers_count || 0) - 1
              }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const title = type === 'followers' ? 'Seguidores' : 'Seguindo';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-96 flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
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
          ) : error ? (
            <div className="p-4 text-center text-red-400">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {type === 'followers' ? 'Nenhum seguidor ainda' : 'Não está seguindo ninguém'}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={user.avatar_url || user.gravatar}
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
                    onClick={() => handleFollowToggle(user.id)}
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
      </div>
    </div>
  );
};

export default FollowList;
