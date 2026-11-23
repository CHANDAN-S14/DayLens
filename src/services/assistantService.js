import apiClient from './apiClient';

export const assistantService = {
  async sendMessage(message, isVoice = false) {
    const res = await apiClient.post('/assistant/chat', { message, isVoice });
    return res.data.data;
  },

  async getHistory() {
    const res = await apiClient.get('/assistant/history');
    return res.data.data;
  },

  async clearHistory() {
    const res = await apiClient.delete('/assistant/history');
    return res.data.data;
  }
};

export default assistantService;
