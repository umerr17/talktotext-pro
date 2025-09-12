"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MeetingSummary } from "@/components/meeting/meeting-summary";
import { TranscriptViewer } from "@/components/meeting/transcript-viewer";
import { ArrowLeft, Download, Share, FileText, MessageSquare } from "lucide-react";
import { getMeetingDetails, Meeting as MeetingData } from "@/lib/api"; // Updated import
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { Skeleton } from '@/components/ui/skeleton';

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
        participants: [], // In a real app, this would come from the backend
        duration: "N/A" // This would also come from backend metadata
    };

    let currentSection = '';

    for (const line of lines) {
        if (line.match(/^#+\s*Executive Summary/i)) {
            currentSection = 'summary';
        } else if (line.match(/^#+\s*Key Discussion Points/i)) {
            currentSection = 'keyPoints';
        } else if (line.match(/^#+\s*Decisions Made/i)) {
            currentSection = 'decisions';
        } else if (line.match(/^#+\s*Action Items/i)) {
            currentSection = 'actionItems';
        } else if (line.match(/^#+\s*Sentiment Analysis/i)) {
            currentSection = 'sentiment';
        } else {
            const cleanLine = line.replace(/^-|\*|\d+\.\s*/, '').trim();
            if (!cleanLine) continue;

            switch (currentSection) {
                case 'summary':
                    parsed.summary = (parsed.summary || "") + cleanLine + " ";
                    break;
                case 'keyPoints':
                    parsed.keyPoints?.push(cleanLine);
                    break;
                case 'decisions':
                    parsed.decisions?.push(cleanLine);
                    break;
                case 'actionItems':
                    parsed.actionItems?.push({ id: Math.random().toString(), task: cleanLine, assignee: 'Unassigned', dueDate: 'N/A', priority: 'medium' });
                    break;
                case 'sentiment':
                     if (cleanLine.toLowerCase().includes('positive')) parsed.sentiment!.overall = 'positive';
                     if (cleanLine.toLowerCase().includes('neutral')) parsed.sentiment!.overall = 'neutral';
                     if (cleanLine.toLowerCase().includes('negative')) parsed.sentiment!.overall = 'negative';
                     parsed.sentiment!.insights.push(cleanLine);
                    break;
            }
        }
    }
    
    parsed.title = lines[0]?.replace(/^#+\s*/, '').trim() || 'Meeting Notes';
    if(parsed.title === "Executive Summary") parsed.title = "Meeting Notes";

    parsed.id = meeting.id.toString();
    parsed.date = new Date(meeting.created_at).toISOString();

    return parsed as ParsedNotes;
};


export default function MeetingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const summaryContentRef = useRef<HTMLDivElement>(null);

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [parsedNotes, setParsedNotes] = useState<ParsedNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const exportToPdf = () => {
    const input = summaryContentRef.current;
    if (input) {
      html2canvas(input, { scale: 2, backgroundColor: null }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${parsedNotes?.title || 'meeting-notes'}.pdf`);
      });
    }
  };

  const exportToWord = () => {
      if (!parsedNotes) return;
      
      const doc = new Document({
          sections: [{
              children: [
                  new Paragraph({ text: parsedNotes.title, heading: HeadingLevel.TITLE }),
                  new Paragraph({ text: `Date: ${new Date(parsedNotes.date).toLocaleDateString()}`, heading: HeadingLevel.HEADING_3 }),
                  new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
                  // **FIXED HERE**: Wrapped the string in an object { text: ... }
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

  // **FIXED HERE**: Only render the main content if data is available
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
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* **FIXED HERE**: Conditional rendering based on data availability */}
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
                {/* Pass a ref to the container for html2canvas to capture */}
                <div ref={summaryContentRef} className="space-y-6 bg-background p-1">
                    <MeetingSummary meeting={parsedNotes} />
                </div>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-6">
                <TranscriptViewer transcript={[{id: '1', speaker: 'Transcript', timestamp: '00:00:00', text: meeting.transcript, confidence: 0.98}]} />
            </TabsContent>
            </Tabs>
        )}
      </main>
    </div>
  );
}