import React, { useState, useRef } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarForContext } from '../utils/avatarUtils';

const AvatarUpload: React.FC = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const avatarFile = avatarInputRef.current?.files?.[0];
    if (!avatarFile) {
      setError('Selecione uma imagem');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await profileAPI.updateProfileWithImages(formData);
      setUser(response.data.user);
      setSuccess('Foto de perfil atualizada com sucesso!');
      setAvatarPreview(null);
      
      // Reset file input
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao atualizar foto de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await profileAPI.deleteAvatar();
      setUser(response.data.user);
      setAvatarPreview(null);
      setSuccess('Foto de perfil removida com sucesso!');
    } catch (error: any) {
      setError('Erro ao remover foto de perfil');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Foto de Perfil</h2>

      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={avatarPreview || getAvatarForContext('profile', user.avatar_url, user.gravatar, user.name, user.email)}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-600 shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex space-x-3">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="btn btn-primary btn-sm"
            >
              Alterar Foto
            </button>
            {user.avatar && (
              <button
                onClick={handleDeleteAvatar}
                className="btn btn-danger btn-sm"
              >
                Remover
              </button>
            )}
          </div>
          
          {avatarPreview && (
            <div className="mt-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-success btn-sm"
              >
                {loading ? 'Salvando...' : 'Salvar Foto'}
              </button>
            </div>
          )}
          
          <p className="text-sm text-gray-400 mt-2">
            Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
