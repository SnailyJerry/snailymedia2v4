// components/SystemSettings.tsx
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Settings, Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SystemSettings({ settings, setSettings }) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSave = () => {
    setSettings(localSettings)
    toast({
      title: "设置已保存",
      description: "您的系统设置已成功更新。",
    })
  }

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey)
  }

  const maskApiKey = (key) => {
    if (!key) return ''
    return '*'.repeat(Math.max(0, key.length - 4)) + key.slice(-4)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>系统设置</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* API Key Input */}
          {/* Model Select */}
          {/* Temperature Slider */}
          {/* Max Tokens Input */}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>保存设置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
