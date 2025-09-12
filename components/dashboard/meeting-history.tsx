"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Calendar, Trash2, Search, History as HistoryIcon } from "lucide-react" 
import { motion } from "framer-motion"
import Link from "next/link"
import { getMeetings, deleteMeeting, Meeting } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MeetingHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true)
        const data = await getMeetings()
        setMeetings(data)
      } catch (err) {
        setError("Failed to load meeting history. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteMeeting(id);
      setMeetings(meetings.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Meeting has been deleted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card className="glass">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <HistoryIcon className="h-5 w-5" />
              Meeting History
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              View and manage your processed meeting recordings
            </CardDescription>
          </div>
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
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                renderSkeleton()
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-8">{error}</TableCell>
                </TableRow>
              ) : filteredMeetings.length > 0 ? (
                filteredMeetings.map((meeting, index) => (
                  <motion.tr
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{meeting.notes.substring(0, 100)}...</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {new Date(meeting.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/meeting/${meeting.id}`}>View Notes</Link>
                        </Button>
                        {/* UPDATED: Replaced DropdownMenu with a direct AlertDialog trigger */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the meeting and its associated notes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(meeting.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                     <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold mb-2">No meetings found</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {searchTerm ? "Try adjusting your search terms" : "Upload your first meeting recording to get started"}
                        </p>
                      </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}