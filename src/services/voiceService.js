import apiClient from './apiClient';

export const voiceService = {
  async speakText(text) {
    try {
      const response = await apiClient.post(
        '/voice/speak',
        { text },
        { responseType: 'blob' }
      );

      // Check if response is audio or json fallback
      if (response.data.type?.includes('audio') || response.headers['content-type']?.includes('audio')) {
        const audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);
        await audio.play();
        return { usedBackendTts: true, audio };
      }
      return { usedBackendTts: false, fallback: true };
    } catch (err) {
      console.warn('[Voice Service] Backend TTS unavailable, using browser speech:', err.message);
      return { usedBackendTts: false, fallback: true };
    }
  },

  async getVoiceStatus() {
    try {
      const res = await apiClient.get('/voice/status');
      return res.data.data;
    } catch (err) {
      return { isConfigured: false, provider: 'Browser Speech Synthesis' };
    }
  }
};

export default voiceService;
