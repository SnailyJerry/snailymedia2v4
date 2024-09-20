// utils/api.ts
import { API_ENDPOINT } from '../constants'

export const sendApiRequest = async (settings, prompt, mediaContent) => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            mediaContent
          ]
        }
      ],
      max_tokens: settings.maxTokens,
      temperature: settings.temperature
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }

  return response.json()
}
