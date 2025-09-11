"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Users, Clock, Calendar, CheckCircle, TrendingUp, MessageSquare, Target, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

interface MeetingSummaryProps {
  meeting: {
    id: string
    title: string
    date: string
    duration: string
    participants: string[]
    summary: string
    keyPoints: string[]
    actionItems: Array<{
      id: string
      task: string
      assignee: string
      dueDate: string
      priority: "high" | "medium" | "low"
    }>
    decisions: string[]
    sentiment: {
      overall: "positive" | "neutral" | "negative"
      score: number
      insights: string[]
    }
  }
}

export function MeetingSummary({ meeting }: MeetingSummaryProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      case "negative":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Meeting Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glass">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{meeting.title}</CardTitle>
                <CardDescription className="text-base">{meeting.summary}</CardDescription>
              </div>
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(meeting.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{meeting.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{meeting.participants.length} participants</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm px-2 py-1 rounded-full ${getSentimentColor(meeting.sentiment.overall)}`}>
                  {meeting.sentiment.overall} ({meeting.sentiment.score}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{meeting.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Discussion Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Key Discussion Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {meeting.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meeting.actionItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${getPriorityColor(item.priority)}`} />
                    <div>
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {item.assignee} • Due {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decisions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Decisions Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {meeting.decisions.map((decision, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground leading-relaxed">{decision}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Sentiment</span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(meeting.sentiment.overall)}`}
                >
                  {meeting.sentiment.overall.charAt(0).toUpperCase() + meeting.sentiment.overall.slice(1)} (
                  {meeting.sentiment.score}%)
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Key Insights</h4>
                <ul className="space-y-2">
                  {meeting.sentiment.insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Participants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {meeting.participants.map((participant, index) => (
                <Badge key={index} variant="secondary">
                  {participant}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
