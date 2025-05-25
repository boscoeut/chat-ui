const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function sendMessage(messages: {role: string, content: string}[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
    }),
  });
  if (!response.ok) throw new Error('OpenAI API error');
  return response.json();
} 