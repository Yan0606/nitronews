import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { Post as PostType } from '../types';
import PostForm from './PostForm';
import Post from './Post';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      setPosts(response.data.data);
      setError('');
    } catch (error: any) {
      setError('Erro ao carregar posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = () => {
    fetchPosts();
  };

  const handlePostDeleted = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">Carregando posts...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {user && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Início</h2>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <img
                src={user.avatar_url || user.gravatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">Meu Perfil</span>
            </button>
          </div>
          <PostForm onPostCreated={handlePostCreated} />
        </div>
      )}
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          {user ? 'Nenhum post encontrado. Seja o primeiro a postar!' : 'Nenhum post público encontrado.'}
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
