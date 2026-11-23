import apiClient from './apiClient';

export const profileService = {
  async getProfile() {
    const res = await apiClient.get('/profile');
    return res.data.data;
  },

  async updateProfile(profileData) {
    const res = await apiClient.put('/profile', profileData);
    return res.data.data;
  }
};

export default profileService;
