import apiClient from './apiClient';

export const analyticsService = {
  async getOverview() {
    const res = await apiClient.get('/analytics/overview');
    return res.data.data;
  },

  async getCorrelations() {
    const res = await apiClient.get('/analytics/correlations');
    return res.data.data;
  },

  async getTrends() {
    const res = await apiClient.get('/analytics/trends');
    return res.data.data;
  },

  async getAnomalies() {
    const res = await apiClient.get('/analytics/anomalies');
    return res.data.data;
  },

  async getInsights() {
    const res = await apiClient.get('/analytics/insights');
    return res.data.data;
  }
};

export default analyticsService;
