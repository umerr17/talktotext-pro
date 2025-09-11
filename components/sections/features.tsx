"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Brain, FileText, Download, Clock, Users, Shield, Zap, CheckCircle, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Mic,
    title: "Smart Transcription",
    description: "Advanced AI converts speech to text with 99% accuracy, handling multiple speakers and accents.",
    badge: "AI-Powered",
  },
  {
    icon: Brain,
    title: "Intelligent Summarization",
    description: "Get executive summaries, key points, and action items automatically extracted from your meetings.",
    badge: "Smart Analysis",
  },
  {
    icon: FileText,
    title: "Structured Notes",
    description: "Organized output with sections for decisions, action items, and follow-ups in professional format.",
    badge: "Professional",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Export to PDF, Word, or share via email. Compatible with all major productivity tools.",
    badge: "Flexible",
  },
  {
    icon: Clock,
    title: "Save 80% Time",
    description: "Transform hours of manual note-taking into minutes of AI-powered processing.",
    badge: "Efficient",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share notes with team members and track action items across your organization.",
    badge: "Collaborative",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with GDPR, SOC2, and enterprise security standards.",
    badge: "Secure",
  },
  {
    icon: TrendingUp,
    title: "Meeting Analytics",
    description: "Track meeting patterns, participation rates, and productivity metrics over time.",
    badge: "Insights",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Powered by Advanced AI
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Everything you need for perfect meeting notes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              From transcription to structured summaries, our AI handles the entire process so you can focus on what
              matters most.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-2xl p-8 sm:p-12">
            <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to transform your meetings?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who save hours every week with AI-powered meeting notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="w-fit mx-auto sm:mx-0">
                ✓ Free 14-day trial
              </Badge>
              <Badge variant="outline" className="w-fit mx-auto sm:mx-0">
                ✓ No credit card required
              </Badge>
              <Badge variant="outline" className="w-fit mx-auto sm:mx-0">
                ✓ Cancel anytime
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
