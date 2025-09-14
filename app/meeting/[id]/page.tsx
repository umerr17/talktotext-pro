"use client";
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MeetingSummary } from "@/components/meeting/meeting-summary";
import { TranscriptViewer } from "@/components/meeting/transcript-viewer";
import { ArrowLeft, Download, FileText, MessageSquare, Mail } from "lucide-react";
import { getMeetingDetails, Meeting as MeetingData, shareMeetingByEmail } from "@/lib/api";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// A type for the parsed, structured notes
type ParsedNotes = {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    summary: string;
    keyPoints: string[];
    actionItems: { id: string; task: string; assignee: string; dueDate: string; priority: "high" | "medium" | "low"; }[];
    decisions: string[];
    sentiment: { overall: "positive" | "neutral" | "negative"; score: number; insights: string[]; };
};

// This utility parses the raw notes text from the backend into a structured object
const parseMeetingNotes = (meeting: MeetingData): ParsedNotes => {
    const notes = meeting.notes;
    const lines = notes.split('\n').filter(line => line.trim() !== '');

    const parsed: Partial<ParsedNotes> & { sentiment: { insights: string[] } } = {
        keyPoints: [],
        actionItems: [],
        decisions: [],
        sentiment: { overall: 'neutral', score: 0, insights: [] },
        participants: [],
        duration: "N/A"
    };
    let currentSection = '';

    for (const line of lines) {
        if (line.match(/^#+\s*Executive Summary/i)) { currentSection = 'summary'; }
        else if (line.match(/^#+\s*Key Discussion Points/i)) { currentSection = 'keyPoints'; }
        else if (line.match(/^#+\s*Decisions Made/i)) { currentSection = 'decisions'; }
        else if (line.match(/^#+\s*Action Items/i)) { currentSection = 'actionItems'; }
        else if (line.match(/^#+\s*Sentiment Analysis/i)) { currentSection = 'sentiment'; }
        else {
            const cleanLine = line.replace(/^-|\*|\d+\.\s*/g, '').trim();
            if (!cleanLine) continue;

            switch (currentSection) {
                case 'summary': parsed.summary = (parsed.summary || "") + cleanLine + " "; break;
                case 'keyPoints': parsed.keyPoints?.push(cleanLine); break;
                case 'decisions': parsed.decisions?.push(cleanLine); break;
                case 'actionItems': parsed.actionItems?.push({ id: Math.random().toString(), task: cleanLine, assignee: 'Unassigned', dueDate: 'N/A', priority: 'medium' }); break;
                case 'sentiment':
                     if (cleanLine.toLowerCase().includes('positive')) parsed.sentiment!.overall = 'positive';
                     else if (cleanLine.toLowerCase().includes('neutral')) parsed.sentiment!.overall = 'neutral';
                     else if (cleanLine.toLowerCase().includes('negative')) parsed.sentiment!.overall = 'negative';
                     parsed.sentiment!.insights.push(cleanLine);
                    break;
            }
        }
    }
    
    // De-duplicate any repeated sections from AI output
    if (parsed.keyPoints) parsed.keyPoints = [...new Set(parsed.keyPoints)];
    if (parsed.decisions) parsed.decisions = [...new Set(parsed.decisions)];
    if (parsed.actionItems) {
        const uniqueTasks = new Map();
        parsed.actionItems.forEach(item => uniqueTasks.set(item.task, item));
        parsed.actionItems = Array.from(uniqueTasks.values());
    }

    parsed.title = meeting.title || 'Meeting Notes';
    parsed.id = meeting.id.toString();
    parsed.date = new Date(meeting.created_at).toISOString();
    return parsed as ParsedNotes;
};

export default function MeetingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [parsedNotes, setParsedNotes] = useState<ParsedNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: State for the share dialog ---
  const { toast } = useToast();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchMeeting = async () => {
        try {
          setIsLoading(true);
          const data = await getMeetingDetails(id);
          setMeeting(data);
          setParsedNotes(parseMeetingNotes(data));
        } catch (err) {
          setError("Failed to load meeting details.");
          if (err instanceof Error && (err.message.includes("404") || err.message.includes("Not found"))) {
            notFound();
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeeting();
    }
  }, [id]);

  // --- NEW: Handler for sending the email ---
  const handleShare = async () => {
    if (!recipientEmail) {
      toast({
        title: "Error",
        description: "Please enter a recipient's email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await shareMeetingByEmail(id, recipientEmail);
      toast({
        title: "Success!",
        description: `Meeting notes have been sent to ${recipientEmail}.`,
      });
      setIsShareDialogOpen(false); // Close the dialog on success
      setRecipientEmail(""); // Clear the input field
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const exportToPdf = () => {
    if (!parsedNotes) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 55; // Generous margin
    const maxLineWidth = pageWidth - margin * 2;
    let y = margin; // Vertical cursor

    const checkAndAddPage = (elementHeight: number) => {
        if (y + elementHeight >= pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // --- RENDER DOCUMENT ELEMENTS ---
    doc.setFont("helvetica", "bold").setFontSize(22);
    const titleLines = doc.splitTextToSize(parsedNotes.title, maxLineWidth);
    const titleHeight = titleLines.length * 22;
    checkAndAddPage(titleHeight);
    doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleHeight + 20;

    doc.setFont("helvetica", "italic").setFontSize(10);
    checkAndAddPage(10);
    doc.text(`Date: ${new Date(parsedNotes.date).toLocaleDateString()}`, margin, y);
    y += 40;

    const renderSection = (title: string, content: string | string[]) => {
      if ((typeof content === 'string' && content.trim()) || (Array.isArray(content) && content.length > 0)) {
        doc.setFont("helvetica", "bold").setFontSize(16);
        checkAndAddPage(16 + 25);
        doc.text(title, margin, y);
        y += 25;

        doc.setFont("helvetica", "normal").setFontSize(11);
        if (Array.isArray(content)) {
          content.forEach(item => {
              const lines = doc.splitTextToSize(item, maxLineWidth - 20);
              const itemHeight = (lines.length * 11) * 1.4;
              checkAndAddPage(itemHeight);
              doc.text(`•`, margin, y + 1);
              doc.text(lines, margin + 20, y, { lineHeightFactor: 1.4 });
              y += itemHeight + 10;
          });
        } else {
          const lines = doc.splitTextToSize(content, maxLineWidth);
          const textHeight = (lines.length * 11) * 1.5;
          checkAndAddPage(textHeight);
          doc.text(lines, margin, y, { lineHeightFactor: 1.5 });
          y += textHeight + 15;
        }
        y += 15;
      }
    };
    renderSection('Executive Summary', parsedNotes.summary);
    renderSection('Key Discussion Points', parsedNotes.keyPoints);
    renderSection('Decisions Made', parsedNotes.decisions);
    renderSection('Action Items', parsedNotes.actionItems.map(item => item.task));

    doc.save(`${parsedNotes?.title || 'meeting-notes'}.pdf`);
  };

  const exportToWord = () => {
      if (!parsedNotes) return;
      const doc = new Document({
          sections: [{
              children: [
                  new Paragraph({ text: parsedNotes.title, heading: HeadingLevel.TITLE }),
                  new Paragraph({ text: `Date: ${new Date(parsedNotes.date).toLocaleDateString()}`, heading: HeadingLevel.HEADING_3 }),
                  new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
                  new Paragraph({ text: parsedNotes.summary }),
                  new Paragraph({ text: "Key Discussion Points", heading: HeadingLevel.HEADING_1 }),
                  ...parsedNotes.keyPoints.map(p => new Paragraph({ text: p, bullet: { level: 0 } })),
                  new Paragraph({ text: "Decisions Made", heading: HeadingLevel.HEADING_1 }),
                  ...parsedNotes.decisions.map(d => new Paragraph({ text: d, bullet: { level: 0 } })),
                  new Paragraph({ text: "Action Items", heading: HeadingLevel.HEADING_1 }),
                  ...parsedNotes.actionItems.map(a => new Paragraph({ text: `${a.task} (Assignee: ${a.assignee})`, bullet: { level: 0 } })),
              ],
          }],
      });
      Packer.toBlob(doc).then(blob => {
          saveAs(blob, `${parsedNotes.title || 'meeting-notes'}.docx`);
      });
  };

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 px-4">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/4 mb-8" />
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
  }
  
  if (error) {
    return <div className="text-center py-20 text-destructive">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/history">
                   <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-4" />
              {parsedNotes && (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                         <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                         <Link href="/dashboard/history">History</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{parsedNotes.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportToPdf}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportToWord}>
                <Download className="h-4 w-4 mr-2" />
                Export Word
              </Button>
              {/* --- MODIFIED: Added share dialog --- */}
              <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Share via Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Share Meeting Notes</DialogTitle>
                    <DialogDescription>
                      Enter an email address to send the notes for "{parsedNotes?.title}".
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="col-span-3"
                        placeholder="recipient@example.com"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleShare} disabled={isSending}>
                      {isSending ? 'Sending...' : 'Send Notes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {parsedNotes && meeting && (
            <Tabs defaultValue="summary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                  Summary & Notes
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Full Transcript
                </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
                <div className="space-y-6 bg-background p-1">
                    <MeetingSummary meeting={parsedNotes} />
                </div>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-6">
              {meeting.original_language && !meeting.original_language.startsWith('en') && meeting.transcript_en ? (
                <Tabs defaultValue="translated" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="original">Original ({meeting.original_language})</TabsTrigger>
                    <TabsTrigger value="translated">English Translation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="original">
                    <TranscriptViewer transcript={[{id: '1', speaker: 'Transcript', timestamp: '00:00:00', text: meeting.transcript, confidence: 0.98}]} />
                  </TabsContent>
                  <TabsContent value="translated">
                    <TranscriptViewer transcript={[{id: '1', speaker: 'Transcript', timestamp: '00:00:00', text: meeting.transcript_en, confidence: 0.98}]} />
                  </TabsContent>
                </Tabs>
              ) : (
                <TranscriptViewer transcript={[{id: '1', speaker: 'Transcript', timestamp: '00:00:00', text: meeting.transcript, confidence: 0.98}]} />
              )}
            </TabsContent>
            </Tabs>
        )}
      </main>
    </div>
  );
}