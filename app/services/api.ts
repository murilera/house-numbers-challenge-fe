export async function summarizeText(request: Request, text: string): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: request.headers.get('Cookie') || '' },
    body: JSON.stringify({ text }),
    credentials: 'include',
  });

  console.log(response)
  if (!response.ok) throw new Error('Failed to summarize');
  const data = await response.json();
  return data.summary || '(No summary returned)';
} 