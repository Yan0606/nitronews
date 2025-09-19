import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { Post as PostType } from '../types';
import { getAvatarForContext } from '../utils/avatarUtils';

interface PostProps {
  post: PostType;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}

const Post: React.FC<PostProps> = ({ post, onPostUpdated, onPostDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editIsPublic, setEditIsPublic] = useState(post.is_public);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(post.content);
    setEditIsPublic(post.is_public);
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditIsPublic(post.is_public);
    setError('');
  };

  const handleSaveEdit = async () => {
    if (editContent.trim().length === 0) {
      setError('O conteúdo não pode estar vazio');
      return;
    }
    
    if (editContent.length > 280) {
      setError('O conteúdo não pode ter mais de 280 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await postsAPI.updatePost(post.id, {
        content: editContent.trim(),
        is_public: editIsPublic,
      });
      setIsEditing(false);
      onPostUpdated();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao atualizar post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) {
      return;
    }

    setLoading(true);

    try {
      await postsAPI.deletePost(post.id);
      onPostDeleted();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao excluir post');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = user && user.id === post.user_id;

  return (
    <div className="post">
      <div className="flex items-start space-x-3">
        <img
          src={getAvatarForContext('post', post.user.avatar_url, post.user.gravatar, post.user.name, post.user.email)}
          alt={post.user.name}
          className="post-avatar"
        />
        <div className="flex-1">
          <div className="post-header">
            <span className="post-author">{post.user.name}</span>
            <span className="post-time">{formatTimeAgo(post.created_at)}</span>
            {!post.is_public && (
              <span className="post-time">• Privado</span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none rounded-lg p-3"
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Postagem pública</span>
                  <button
                    type="button"
                    onClick={() => setEditIsPublic(!editIsPublic)}
                    className={`toggle-switch ${editIsPublic ? 'active' : 'inactive'}`}
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  {editContent.length}/280
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading || editContent.trim().length === 0}
                  className="btn btn-primary btn-sm"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="btn btn-secondary btn-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="post-content">{post.content}</p>
              
              {canEdit && (
                <div className="post-actions">
                  <button
                    onClick={handleEdit}
                    className="post-action"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="post-action delete"
                  >
                    {loading ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-3 text-red-400 text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
