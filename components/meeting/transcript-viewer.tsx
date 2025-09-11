"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Search, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface TranscriptSegment {
  id: string
  speaker: string
  timestamp: string
  text: string
  confidence: number
}

interface TranscriptViewerProps {
  transcript: TranscriptSegment[]
  audioUrl?: string
}

const mockTranscript: TranscriptSegment[] = [
  {
    id: "1",
    speaker: "Sarah Chen",
    timestamp: "00:00:15",
    text: "Good morning everyone, thank you for joining today's product strategy meeting. Let's start by reviewing our Q1 roadmap and discussing the feature prioritization for our upcoming release.",
    confidence: 0.98,
  },
  {
    id: "2",
    speaker: "Mike Rodriguez",
    timestamp: "00:00:45",
    text: "Thanks Sarah. I've been analyzing the user feedback from our beta testing, and there are three key areas that users are consistently requesting improvements in.",
    confidence: 0.95,
  },
  {
    id: "3",
    speaker: "Emily Johnson",
    timestamp: "00:01:12",
    text: "Before we dive into that, can we quickly review the current development timeline? I want to make sure we're aligned on what's realistic for the next sprint.",
    confidence: 0.97,
  },
  {
    id: "4",
    speaker: "David Park",
    timestamp: "00:01:35",
    text: "Absolutely. From the engineering perspective, we're on track with the core features, but we'll need to prioritize carefully if we want to include the advanced analytics dashboard.",
    confidence: 0.96,
  },
  {
    id: "5",
    speaker: "Sarah Chen",
    timestamp: "00:02:08",
    text: "That's exactly what I wanted to discuss. Let's break down each feature request and evaluate them based on user impact, development effort, and strategic alignment.",
    confidence: 0.99,
  },
]

export function TranscriptViewer({ transcript = mockTranscript, audioUrl }: TranscriptViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00:00")

  const filteredTranscript = transcript.filter(
    (segment) =>
      segment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      segment.speaker.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return "bg-green-500"
    if (confidence >= 0.9) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control audio playback
  }

  const jumpToTimestamp = (timestamp: string) => {
    setCurrentTime(timestamp)
    // In a real app, this would seek to the specific time in the audio
  }

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      {audioUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Audio Playback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button onClick={handlePlayPause} size="icon">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">{currentTime} / 45:32</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transcript */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Full Transcript
                </CardTitle>
                <CardDescription>AI-generated transcript with speaker identification and timestamps</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transcript..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              <div className="space-y-4">
                {filteredTranscript.map((segment, index) => (
                  <motion.div
                    key={segment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-medium">
                          {segment.speaker}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-primary"
                          onClick={() => jumpToTimestamp(segment.timestamp)}
                        >
                          {segment.timestamp}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`h-2 w-2 rounded-full ${getConfidenceColor(segment.confidence)}`}
                          title={`Confidence: ${(segment.confidence * 100).toFixed(1)}%`}
                        />
                        <span className="text-xs text-muted-foreground">{(segment.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {searchTerm
                        ? segment.text.split(new RegExp(`(${searchTerm})`, "gi")).map((part, i) =>
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <mark key={i} className="bg-primary/20 text-primary">
                                {part}
                              </mark>
                            ) : (
                              part
                            ),
                          )
                        : segment.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            {filteredTranscript.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or clear the search to view all transcript segments.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
