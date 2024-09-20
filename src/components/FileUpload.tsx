// components/FileUpload.tsx
import React from 'react'
import { Upload } from "lucide-react"

export function FileUpload({ onFileChange, files }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">点击上传</span> 或拖拽文件到这里</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">支持PNG, JPG, GIF 或 MP4 (最大. 20MB)</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={onFileChange} multiple accept="image/*,video/*" />
        </label>
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">已选择的文件：</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
