import axios from 'axios';

export async function synthesizeSpeech(text) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default Rachel voice

  if (!apiKey) {
    return {
      available: false,
      message: 'ElevenLabs API key not configured. Using client-side speech synthesis.',
      audioBuffer: null
    };
  }

  try {
    const cleanText = text.replace(/[*#•]/g, '').trim();
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: cleanText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer',
        timeout: 10000
      }
    );

    return {
      available: true,
      audioBuffer: Buffer.from(response.data),
      contentType: 'audio/mpeg'
    };
  } catch (error) {
    console.error('[Voice Service] ElevenLabs error:', error.response?.data?.toString() || error.message);
    return {
      available: false,
      message: 'Failed to synthesize via ElevenLabs. Fallback to client speech synthesis.',
      audioBuffer: null
    };
  }
}

export function getVoiceConfig() {
  return {
    isConfigured: !!process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',
    provider: 'ElevenLabs Text-to-Speech'
  };
}
