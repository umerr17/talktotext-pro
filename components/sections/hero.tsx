"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Upload, FileText, Download } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Transform Meeting Recordings into <span className="text-primary">Professional Notes</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty"
          >
            Upload your meeting recordings and let AI create structured summaries, action items, and key insights. Save
            hours of manual note-taking with intelligent transcription and organization.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Process visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <div className="glass rounded-2xl p-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Upload</h3>
                  <p className="text-xs text-muted-foreground mt-1">Drop your audio file</p>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />

                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Process</h3>
                  <p className="text-xs text-muted-foreground mt-1">AI analyzes & structures</p>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />

                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Export</h3>
                  <p className="text-xs text-muted-foreground mt-1">Get organized notes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
