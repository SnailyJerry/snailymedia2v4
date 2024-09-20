
// SnailyMediaReader.tsx
import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Send, Loader2, AlertTriangle, Pause, Play } from "lucide-react"
import { SystemSettings } from './components/SystemSettings'
import { FileUpload } from './components/FileUpload'
import { UrlInput } from './components/UrlInput'
import { ResultDisplay } from './components/ResultDisplay'
import { useMediaProcessing } from './hooks/useMediaProcessing'

export default function SnailyMediaReader() {
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([''])
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'glm-4v-plus',
    temperature: 0.7,
    maxTokens: 300
  })

  const {
    results,
    isLoading,
    error,
    progress,
    isPaused,
    processMedia,
    handlePause,
    handleResume,
    handleStop
  } = useMediaProcessing(settings)

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles(selectedFiles)
  }

  const handleSubmit = async () => {
    const allMedia = [...files, ...urls.filter(url => url.trim() !== '')]
    processMedia(allMedia, prompt)
  }

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const pastedUrls = pastedText.split(/\s+/).filter(url => url.trim() !== '')
    setUrls(pastedUrls)
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">SnailyMediaReader</h1>
      <p className="text-center text-lg mb-8 text-muted-foreground">用文字看见图片和视频</p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              上传设置
              <SystemSettings settings={settings} setSettings={setSettings} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">文件上传</TabsTrigger>
                <TabsTrigger value="url">URL 链接</TabsTrigger>
              </TabsList>
              <TabsContent value="file">
                <div className="space-y-4">
                  <Textarea 
                    placeholder="请输入提示词" 
                    className="w-full" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <FileUpload onFileChange={handleFileChange} files={files} />
                </div>
              </TabsContent>
              <TabsContent value="url">
                <div className="space-y-4">
                  <Textarea 
                    placeholder="请输入提示词" 
                    className="w-full" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <UrlInput urls={urls} setUrls={setUrls} handlePaste={handlePaste} />
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between">
                <Button onClick={handleSubmit} disabled={isLoading || isPaused}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isLoading ? '处理中...' : '提交'}
                </Button>
                {isLoading && (
                  <>
                    {isPaused ? (
                      <Button onClick={handleResume}>
                        <Play className="mr-2 h-4 w-4" />
                        继续
                      </Button>
                    ) : (
                      <Button onClick={handlePause}>
                        <Pause className="mr-2 h-4 w-4" />
                        暂停
                      </Button>
                    )}
                    <Button onClick={handleStop} variant="destructive">
                      停止
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>结果</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultDisplay results={results} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
