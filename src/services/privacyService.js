import apiClient from './apiClient';

export const privacyService = {
  async getConsent() {
    const res = await apiClient.get('/privacy/consent');
    return res.data.data;
  },

  async updateConsent(settings) {
    const res = await apiClient.put('/privacy/consent', settings);
    return res.data.data;
  },

  async exportAllTakeout() {
    const res = await apiClient.post('/privacy/export-all', {}, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daylens-takeout-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  },

  async deleteAllAccountData() {
    const res = await apiClient.delete('/privacy/delete-all');
    localStorage.removeItem('daylens_token');
    localStorage.removeItem('daylens_user');
    return res.data;
  }
};

export default privacyService;
