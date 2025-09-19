import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterRequest } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
          <h2 className="login-title">
            Crie sua conta
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-group">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="form-input"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="error-message">{errors.name}</p>
              )}
            </div>
            <div className="form-group">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>
            <div className="form-group">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
            <div className="form-group">
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                className="form-input"
                placeholder="Confirmação de senha"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <p className="error-message">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="text-red-400 text-sm text-center">{errors.general}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="link">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
