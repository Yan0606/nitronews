import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { CreatePostRequest } from '../types';
import { getAvatarForContext } from '../utils/avatarUtils';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length === 0) {
      setError('O conteúdo não pode estar vazio');
      return;
    }
    
    if (content.length > 280) {
      setError('O conteúdo não pode ter mais de 280 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData: CreatePostRequest = {
        content: content.trim(),
        is_public: isPublic,
      };
      
      await postsAPI.createPost(postData);
      setContent('');
      onPostCreated();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 280) {
      setContent(value);
      setError('');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="post-form">
      <h2 className="post-form-title">Início</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="post-input-group">
          <img
            src={getAvatarForContext('post', user.avatar_url, user.gravatar, user.name, user.email)}
            alt={user.name}
            className="post-avatar"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="O que está acontecendo?"
              className="post-textarea"
              rows={3}
            />
          </div>
        </div>

        <div className="post-controls">
          <div className="post-toggle">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Postagem pública</span>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`toggle-switch ${isPublic ? 'active' : 'inactive'}`}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {content.length}/280
            </span>
            <button
              type="submit"
              disabled={loading || content.trim().length === 0}
              className="btn btn-primary btn-sm"
            >
              {loading ? 'Postando...' : 'Postar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 text-red-400 text-sm">{error}</div>
        )}
      </form>
    </div>
  );
};

export default PostForm;
