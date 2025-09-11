"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Calendar, Clock, MoreHorizontal, Download, Share, Trash2, Search } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Meeting {
  id: string
  title: string
  date: string
  duration: string
  status: "completed" | "processing" | "failed"
  participants: number
  summary: string
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Strategy Meeting",
    date: "2024-01-15",
    duration: "45 min",
    status: "completed",
    participants: 5,
    summary: "Discussed Q1 roadmap and feature prioritization for the upcoming release.",
  },
  {
    id: "2",
    title: "Weekly Team Standup",
    date: "2024-01-14",
    duration: "30 min",
    status: "completed",
    participants: 8,
    summary: "Team updates on current sprint progress and blockers identification.",
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "2024-01-12",
    duration: "60 min",
    status: "processing",
    participants: 3,
    summary: "Presenting new design concepts and gathering client feedback.",
  },
  {
    id: "4",
    title: "Budget Review",
    date: "2024-01-10",
    duration: "90 min",
    status: "completed",
    participants: 4,
    summary: "Quarterly budget analysis and resource allocation planning.",
  },
  {
    id: "5",
    title: "Engineering Sync",
    date: "2024-01-08",
    duration: "40 min",
    status: "failed",
    participants: 6,
    summary: "Technical architecture discussion and code review session.",
  },
]

export function MeetingHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [meetings] = useState<Meeting[]>(mockMeetings)

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Completed
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  return (
    <Card className="glass">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-5 w-5" />
              Meeting History
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View and manage your processed meeting recordings
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.map((meeting, index) => (
                <motion.tr
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{meeting.summary}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(meeting.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {meeting.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{meeting.participants} people</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {meeting.status === "completed" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/meeting/${meeting.id}`}>View Notes</Link>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.status === "completed" && (
                            <>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{meeting.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{meeting.summary}</p>
                    </div>
                    <div className="ml-3 flex-shrink-0">{getStatusBadge(meeting.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {new Date(meeting.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {meeting.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {meeting.participants} people
                    </Badge>

                    <div className="flex items-center space-x-2">
                      {meeting.status === "completed" && (
                        <Button variant="outline" size="sm" asChild className="h-8 text-xs bg-transparent">
                          <Link href={`/meeting/${meeting.id}`}>View Notes</Link>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.status === "completed" && (
                            <>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No meetings found</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Upload your first meeting recording to get started"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
