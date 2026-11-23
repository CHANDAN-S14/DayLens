import apiClient from './apiClient';

export const experimentService = {
  async getExperiments() {
    const res = await apiClient.get('/experiments');
    return res.data.data;
  },

  async createExperiment(data) {
    const res = await apiClient.post('/experiments', data);
    return res.data.data;
  },

  async updateExperiment(id, data) {
    const res = await apiClient.put(`/experiments/${id}`, data);
    return res.data.data;
  },

  async deleteExperiment(id) {
    const res = await apiClient.delete(`/experiments/${id}`);
    return res.data.data;
  },

  async toggleDay(id, date) {
    const res = await apiClient.patch(`/experiments/${id}/toggle-day`, { date });
    return res.data.data;
  },

  async updateStatus(id, status) {
    const res = await apiClient.patch(`/experiments/${id}/status`, { status });
    return res.data.data;
  },

  async getComparison(id) {
    const res = await apiClient.get(`/experiments/${id}/comparison`);
    return res.data.data;
  }
};

export default experimentService;
