const apiKey = process.env.OPENAI_API_KEY;

async function transcribeAudio(audioURL: string) {
  const audioResponse = await fetch(audioURL);
  const audioBuffer = await audioResponse.arrayBuffer();
  const audio = new Blob([audioBuffer], { type: 'audio/mp3' });

  const formData = new FormData();
  formData.append('file', audio);
  formData.append('model', 'whisper-1');
  formData.append('language', 'pt');
  formData.append('response_format', 'json');
  formData.append('temperature', '0');

  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return await response.json();
}

export { transcribeAudio };
