import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { profileAPI, followAPI } from '../services/api';
import { User, ProfileResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import FollowList from './FollowList';
import { getAvatarForContext } from '../utils/avatarUtils';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts');
  const [showFollowList, setShowFollowList] = useState<'followers' | 'following' | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile(username);
      setProfile(response.data);
      setIsFollowing(response.data.is_following);
    } catch (error: any) {
      setError('Erro ao carregar perfil');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profile?.user) return;

    try {
      setFollowLoading(true);
      const response = await followAPI.toggleFollow(profile.user.id);
      setIsFollowing(response.data.is_following);
      
      // Update followers count
      setProfile(prev => prev ? {
        ...prev,
        user: {
          ...prev.user,
          followers_count: response.data.is_following 
            ? (prev.user.followers_count || 0) + 1
            : (prev.user.followers_count || 0) - 1
        }
      } : null);
    } catch (error: any) {
      console.error('Error toggling follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando perfil...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || 'Perfil não encontrado'}</div>
      </div>
    );
  }

  const { user } = profile;
  const isOwnProfile = profile.is_own_profile;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl mb-4 overflow-hidden">
        {user.cover_photo ? (
          <img
            src={`http://localhost:8000/storage/${user.cover_photo}`}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm opacity-75">Sem foto de capa</p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 -mt-16 relative z-10 border border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={getAvatarForContext('profile', user.avatar_url, user.gravatar, user.name, user.email)}
                alt={user.name}
                className="profile-avatar"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {user.username && (
                <p className="text-gray-400">@{user.username}</p>
              )}
              {user.bio && (
                <p className="text-gray-300 mt-2">{user.bio}</p>
              )}
              
              {/* Profile Details */}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                {user.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                      {user.website}
                    </a>
                  </div>
                )}
                {user.birth_date && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(user.birth_date).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
            >
              {followLoading ? '...' : isFollowing ? 'Seguindo' : 'Seguir'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div className="text-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white">{user.posts_count || 0}</div>
            <div className="text-sm text-gray-400">Posts</div>
          </div>
          
          <button
            onClick={() => setShowFollowList('followers')}
            className="text-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200">{user.followers_count || 0}</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Seguidores</div>
          </button>
          
          <button
            onClick={() => setShowFollowList('following')}
            className="text-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200">{user.following_count || 0}</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Seguindo</div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-xl shadow-lg mt-4 border border-gray-700">
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'posts' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Posts
            </button>
            <button 
              onClick={() => setActiveTab('followers')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'followers' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Seguidores
            </button>
            <button 
              onClick={() => setActiveTab('following')}
              className={`py-4 px-1 border-b-2 font-medium transition-colors duration-200 ${
                activeTab === 'following' 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Seguindo
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'posts' && (
            <p className="text-gray-400 text-center py-8">
              Posts do usuário aparecerão aqui
            </p>
          )}
          {activeTab === 'followers' && (
            <p className="text-gray-400 text-center py-8">
              Lista de seguidores aparecerá aqui
            </p>
          )}
          {activeTab === 'following' && (
            <p className="text-gray-400 text-center py-8">
              Lista de pessoas que está seguindo aparecerá aqui
            </p>
          )}
        </div>
      </div>

      {/* Follow List Modal */}
      {showFollowList && profile && (
        <FollowList
          userId={profile.user.id}
          type={showFollowList}
          onClose={() => setShowFollowList(null)}
        />
      )}
    </div>
  );
};

export default Profile;
