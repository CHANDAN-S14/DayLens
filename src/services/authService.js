import apiClient from './apiClient';

export const authService = {
  async register({ name, email, password, seedDemoData = true }) {
    const res = await apiClient.post('/auth/register', { name, email, password, seedDemoData });
    const { token, user } = res.data.data;
    if (token) {
      localStorage.setItem('daylens_token', token);
      localStorage.setItem('daylens_user', JSON.stringify(user));
    }
    return { token, user };
  },

  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token, user } = res.data.data;
    if (token) {
      localStorage.setItem('daylens_token', token);
      localStorage.setItem('daylens_user', JSON.stringify(user));
    }
    return { token, user };
  },

  async demoLogin() {
    const res = await apiClient.post('/auth/demo-login');
    const { token, user } = res.data.data;
    if (token) {
      localStorage.setItem('daylens_token', token);
      localStorage.setItem('daylens_user', JSON.stringify(user));
    }
    return { token, user };
  },

  async getMe() {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },

  logout() {
    localStorage.removeItem('daylens_token');
    localStorage.removeItem('daylens_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('daylens_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('daylens_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('daylens_token');
  }
};

export default authService;
