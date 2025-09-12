"use client";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOngoingTasks, deleteTask } from "@/lib/api";

interface UploadFile {
  id: string;
  file: File | { name: string; size: number };
  status: "uploading" | "processing" | "completed" | "error" | "pending";
  progress: number; // This will be the target progress from the backend
  details: string;
}

// --- NEW: SmoothedProgress Component ---
// This component manages the smooth animation from a start to an end value.
const SmoothedProgress = ({ targetProgress }: { targetProgress: number }) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        // When the targetProgress from the backend updates, we start an interval.
        const interval = setInterval(() => {
            setDisplayProgress(prev => {
                if (prev < targetProgress) {
                    // Increment the display value until it reaches the target
                    return prev + 1;
                }
                // Once reached, clear the interval.
                clearInterval(interval);
                return targetProgress;
            });
        }, 20); // The interval duration controls the speed of the animation.

        return () => clearInterval(interval); // Cleanup on component unmount or re-render
    }, [targetProgress]);

    return <Progress value={displayProgress} className="h-2" />;
};


export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAndPollOngoingTasks = async () => {
      try {
        const ongoingTasks = await getOngoingTasks();
        const tasksToDisplay: UploadFile[] = ongoingTasks.map(task => {
          pollProgress(task.id);
          return {
            id: task.id,
            file: { name: task.original_filename, size: 0 },
            status: task.status.toLowerCase() as "processing" | "pending",
            progress: task.progress_percent,
            details: task.details,
          };
        });
        
        setFiles(prev => {
            const existingIds = new Set(prev.map(f => f.id));
            const newTasks = tasksToDisplay.filter(t => !existingIds.has(t.id));
            return [...newTasks, ...prev];
        });
      } catch (error) {
        console.error("Failed to fetch ongoing tasks", error);
      }
    };
    fetchAndPollOngoingTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pollProgress = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
             clearInterval(interval);
             setFiles((prev) => prev.filter((f) => f.id !== taskId));
             return;
        }
        if (!res.ok) throw new Error("Progress fetch failed");

        const data = await res.json();
        
        setFiles((prev) =>
          prev.map((f) =>
            f.id === taskId
              ? {
                  ...f,
                  status: data.status.toLowerCase(),
                  progress: data.progress_percent,
                  details: data.details,
                }
              : f
          )
        );

        if (data.status === "Completed") {
            clearInterval(interval);
            setTimeout(() => router.push(`/meeting/${data.meeting_id}`), 1500);
        }

        if (data.status === "Error") {
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
        setFiles((prev) =>
            prev.map((f) => (f.id === taskId ? { ...f, status: "error", details: "Could not retrieve processing status." } : f))
        );
      }
    }, 2500);
  };

  const handleUpload = async (file: File) => {
    const tempId = Math.random().toString(36).substring(2, 9);
    const uploadFile: UploadFile = {
      id: tempId,
      file,
      status: "uploading",
      progress: 0,
      details: "Preparing upload...",
    };
    setFiles((prev) => [uploadFile, ...prev]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
          router.push("/login");
          return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload-audio`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const progress = Math.round((progressEvent.loaded / total) * 100);
          setFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, progress, details: "Uploading file..." } : f))
          );
        },
      });
      
      const { task_id } = res.data;

      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, id: task_id, status: "pending", progress: 100, details: "Upload complete, queueing task..." } : f))
      );
      
      // Brief delay to show upload completion before polling starts
      setTimeout(() => {
          pollProgress(task_id);
      }, 1000);

    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || "Upload failed.";
      setFiles((prev) =>
        prev.map((f) => (f.id === tempId ? { ...f, status: "error", details: errorDetail, progress: 0 } : f))
      );
    }
  };
  
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
      acceptedFiles.forEach(handleUpload);
      fileRejections.forEach((rejection) => {
          const { file, errors } = rejection;
          const errorDetail = errors[0].code === 'file-too-large' 
            ? `File is too large. Max size is 1GB.`
            : errors[0].message;
          
          const errorFile: UploadFile = {
            id: Math.random().toString(36).substring(2, 9),
            file,
            status: "error",
            progress: 0,
            details: errorDetail
          };
          setFiles(prev => [errorFile, ...prev]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = async (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (!fileToRemove) return;

    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    
    if (fileToRemove.status !== 'completed' && fileToRemove.status !== 'uploading' && fileToRemove.status !== "error") {
      try {
        await deleteTask(fileId);
      } catch (error) {
        console.error("Failed to delete task from backend:", error);
      }
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxSize: 1024 * 1024 * 1024, // 1GB
  });

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
            <p className="text-muted-foreground mb-4">Drag and drop audio/video, or click to browse</p>
            <Button variant="outline">Choose Files</Button>
            <p className="text-xs text-muted-foreground mt-4">Supports MP3, WAV, M4A, MP4, MOV (max 1GB)</p>
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
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="truncate">
                          <p className="font-medium text-sm truncate">{uploadFile.file.name}</p>
                          {uploadFile.file.size > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {(uploadFile.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         {uploadFile.status === "completed" ? (
                          <Badge variant="default" className="bg-green-500/80 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : uploadFile.status === "error" ? (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="capitalize">{uploadFile.status}</Badge>
                        )}
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-xs">{uploadFile.details}</span>
                        <span className="text-muted-foreground text-xs font-medium">{Math.round(uploadFile.progress)}%</span>
                      </div>
                      {/* --- MODIFIED: Use the new SmoothedProgress component --- */}
                      <SmoothedProgress targetProgress={uploadFile.progress} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}