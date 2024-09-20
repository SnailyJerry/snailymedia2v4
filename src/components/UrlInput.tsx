// components/UrlInput.tsx
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clipboard } from "lucide-react"

export function UrlInput({ urls, setUrls, handlePaste }) {
  const handleUrlChange = (index, value) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const addUrlInput = () => {
    setUrls([...urls, ''])
  }

  const removeUrlInput = (index) => {
    const newUrls = urls.filter((_, i) => i !== index)
    setUrls(newUrls)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Textarea
          placeholder="粘贴多个URL，每行一个"
          className="w-full"
          rows={5}
          onPaste={handlePaste}
          value={urls.join('\n')}
          onChange={(e) => setUrls(e.target.value.split('\n'))}
        />
        <Button onClick={() => setUrls([])} variant="outline">
          <Clipboard className="h-4 w-4" />
        </Button>
      </div>
      {urls.map((url, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            type="url"
            placeholder={`URL #${index + 1}`}
            value={url}
            onChange={(e) => handleUrlChange(index, e.target.value)}
          />
          {index === urls.length - 1 ? (
            <Button onClick={addUrlInput} variant="outline">+</Button>
          ) : (
            <Button onClick={() => removeUrlInput(index)} variant="outline">-</Button>
          )}
        </div>
      ))}
    </div>
  )
}
