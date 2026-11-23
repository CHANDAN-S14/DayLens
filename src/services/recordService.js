import apiClient from './apiClient';

export const recordService = {
  async getRecords(params = {}) {
    const res = await apiClient.get('/records', { params });
    return res.data.data;
  },

  async saveRecord(record) {
    const res = await apiClient.post('/records', record);
    return res.data.data;
  },

  async updateRecord(id, fields) {
    const res = await apiClient.put(`/records/${id}`, fields);
    return res.data.data;
  },

  async deleteRecord(id) {
    const res = await apiClient.delete(`/records/${id}`);
    return res.data.data;
  },

  async importCsv(csvText) {
    const res = await apiClient.post('/records/import-csv', { csvText });
    return res.data.data;
  },

  async exportRecords(format = 'json') {
    const res = await apiClient.get(`/records/export?format=${format}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return res.data;
  }
};

export default recordService;
