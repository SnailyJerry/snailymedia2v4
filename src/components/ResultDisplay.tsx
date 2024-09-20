// components/ResultDisplay.tsx
import React from 'react'
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function ResultDisplay({ results }) {
  const handleCopyAll = () => {
    navigator.clipboard.writeText(results.map(r => `URL: ${r.url}\n结果: ${r.result}`).join('\n\n'))
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
      {results.length > 0 ? (
        results.map((result, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-semibold mb-2">结果 {index + 1}:</h3>
            <p className="text-sm text-muted-foreground mb-2 break-all">{result.url}</p>
            <Textarea 
              value={result.result} 
              readOnly 
              className="w-full mt-2"
            />
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">结果将在这里显示...</p>
      )}
      {results.length > 0 && (
        <Button className="w-full mt-4" onClick={handleCopyAll}>
          <Copy className="mr-2 h-4 w-4" /> 一键复制所有结果
        </Button>
      )}
    </div>
  )
}
