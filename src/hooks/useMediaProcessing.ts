// hooks/useMediaProcessing.ts
import { useState, useRef } from 'react'
import { sendApiRequest } from '../utils/api'
import { fileToBase64 } from '../utils/helpers'
import { API_BATCH_SIZE, API_RATE_LIMIT, MAX_RETRIES } from '../constants'

export const useMediaProcessing = (settings) => {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const abortControllerRef = useRef(null)

  const processMediaBatch = async (batch, batchIndex, totalItems, prompt) => {
    const batchResults = await Promise.all(batch.map(async (item) => {
      let retries = 0
      while (retries < MAX_RETRIES) {
        try {
          let mediaContent
          if (item instanceof File) {
            const base64 = await fileToBase64(item)
            mediaContent = {
              type: item.type.startsWith('image/') ? 'image_url' : 'video_url',
              [item.type.startsWith('image/') ? 'image_url' : 'video_url']: {
                url: `data:${item.type};base64,${base64}`
              }
            }
          } else {
            mediaContent = {
              type: item.toLowerCase().endsWith('.mp4') ? 'video_url' : 'image_url',
              [item.toLowerCase().endsWith('.mp4') ? 'video_url' : 'image_url']: {
                url: item
              }
            }
          }

          const data = await sendApiRequest(settings, prompt, mediaContent)

          if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid API response format')
          }

          return { url: item instanceof File ? item.name : item, result: data.choices[0].message.content }
        } catch (error) {
          console.error('Error processing media:', item, error)
          retries++
          if (retries >= MAX_RETRIES) {
            return { url: item instanceof File ? item.name : item, result: `Error: ${error.message}` }
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retries))
        }
      }
    }))

    setResults(prevResults => [...prevResults, ...batchResults])
    setProgress((batchIndex + 1) * API_BATCH_SIZE * 100 / totalItems)
  }

  const processMedia = async (allMedia, prompt) => {
    setIsLoading(true)
    setError(null)
    setResults([])
    setProgress(0)
    setIsPaused(false)

    const batches = []
    for (let i = 0; i < allMedia.length; i += API_BATCH_SIZE) {
      batches.push(allMedia.slice(i, i + API_BATCH_SIZE))
    }

    abortControllerRef.current = new AbortController()

    try {
      for (let i = 0; i < batches.length; i++) {
        if (isPaused) {
          await new Promise(resolve => {
            const checkPaused = () => {
              if (!isPaused) {
                resolve()
              } else {
                setTimeout(checkPaused, 100)
              }
            }
            checkPaused()
          })
        }

        if (abortControllerRef.current.signal.aborted) {
          break
        }

        await processMediaBatch(batches[i], i, allMedia.length, prompt)

        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 60000 / API_RATE_LIMIT))
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message || '处理请求时发生错误。请检查您的设置并重试。')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePause = () => setIsPaused(true)
  const handleResume = () => setIsPaused(false)
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsLoading(false)
    setIsPaused(false)
  }

  return {
    results,
    isLoading,
    error,
    progress,
    isPaused,
    processMedia,
    handlePause,
    handleResume,
    handleStop
  }
}
