"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UploadFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  stage?: "transcribing" | "translating" | "summarizing" | "done"
}

export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading" as const,
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((uploadFile) => {
      simulateProcessing(uploadFile.id)
    })
  }, [])

  const simulateProcessing = (fileId: string) => {
    const stages = [
      { stage: "transcribing" as const, duration: 2000 },
      { stage: "translating" as const, duration: 1500 },
      { stage: "summarizing" as const, duration: 1000 },
      { stage: "done" as const, duration: 500 },
    ]

    let currentStage = 0
    let progress = 0

    const updateProgress = () => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: currentStage < stages.length ? "processing" : "completed",
                progress: Math.min(progress, 100),
                stage: stages[currentStage]?.stage,
              }
            : f,
        ),
      )

      if (progress < 100) {
        progress += Math.random() * 15
        setTimeout(updateProgress, 200)
      } else if (currentStage < stages.length - 1) {
        currentStage++
        progress = 0
        setTimeout(updateProgress, 200)
      }
    }

    updateProgress()
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".aac"],
      "video/*": [".mp4", ".mov", ".avi"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const getStageText = (stage?: string) => {
    switch (stage) {
      case "transcribing":
        return "Transcribing audio..."
      case "translating":
        return "Processing content..."
      case "summarizing":
        return "Generating summary..."
      case "done":
        return "Complete!"
      default:
        return "Uploading..."
    }
  }

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop files here" : "Upload meeting recordings"}
            </h3>
            <p className="text-muted-foreground mb-4">Drag and drop your audio or video files, or click to browse</p>
            <Button variant="outline">Choose Files</Button>
            <p className="text-xs text-muted-foreground mt-4">Supports MP3, WAV, M4A, MP4, MOV (max 100MB)</p>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Processing Files</h3>
            {files.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{uploadFile.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === "completed" ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : uploadFile.status === "error" ? (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Processing</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{getStageText(uploadFile.stage)}</span>
                        <span className="text-muted-foreground">{Math.round(uploadFile.progress)}%</span>
                      </div>
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
