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

async function reduceTranscript(transcript: string) {
  if (transcript.length <= 1000)
    return transcript;

  const url = "https://api.openai.com/v1/chat/completions";
  const model = "gpt-3.5-turbo";
  const systemPrompt = "Você é um assistente acadêmico. Resuma esta parte da aula em 1000 palavras, mantendo conceitos-chave e exemplos.";
  
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: transcript }
  ];
  
  const jsonBody = JSON.stringify({
    model,
    messages,
    temperature: 0.3,
    response_format: { type: "text" },
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: jsonBody,
    });

    const jsonResponse = await response.json();
    const text = jsonResponse.choices[0].message.content as string;

    return text;
  } catch (error) {
    console.error(error);
    throw new Error(`Erro ao processar resumo: ${error}`);
  }
}

async function summarizeTranscript(transcript: string) {
  const url = "https://api.openai.com/v1/chat/completions";
  const model = "gpt-4o-mini";
  const systemPrompt = "Você é um assistente acadêmico. Resuma esta transcrição de aula. Mantenha precisão acadêmica e use HTML para ênfase quando necessário.";
  
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: transcript }
  ];

  const jsonSchema = {
    name: 'class_summary',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: 'Resumo conciso em 1000 palavras',
        },
        actionItems: {
          type: 'array',
          description: 'Lista de acontecimentos relevantes que ocorreram ao longo da aula',
          items: {
            type: 'string',
            description: 'Descrição do acontecimento relevante em até 20 palavras',
          },
        },
        keyConcepts: {
          type: 'array',
          description: 'Lista de até 5 conceitos chaves',
          items: {
            type: 'string',
            description: 'Conceito chave de até 5 palavras',
          },
        },
        examples: {
          type: 'array',
          description: 'Lista de exemplos relevantes',
          items: {
            type: 'string',
            description: 'Descrição do exemplo relevante de até 30 palavras',
          },
        },
      },
      additionalProperties: false,
      required: ['summary', 'actionItems', 'keyConcepts'],
    },
  };
  
  const jsonBody = JSON.stringify({
    model,
    messages,
    temperature: 0.3,
    response_format: {
      type: "json_schema",
      json_schema: jsonSchema,
    },
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: jsonBody
  });

  if (!response.ok) 
    throw new Error(`OpenAI responded with error: ${response.statusText}`);

  const jsonResponse = await response.json();
  const text = jsonResponse.choices[0].message.content as string;
  const json = JSON.parse(text);

  return json;
}

export {
  transcribeAudio,
  reduceTranscript,
  summarizeTranscript
};
