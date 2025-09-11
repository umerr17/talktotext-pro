"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/professional-woman-diverse.png",
    content:
      "TalkToText Pro has revolutionized how our team handles meeting documentation. What used to take me 2 hours now takes 10 minutes.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "CEO",
    company: "StartupXYZ",
    avatar: "/professional-man.png",
    content:
      "The AI-generated action items are incredibly accurate. Our team productivity has increased by 40% since we started using this tool.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Operations Director",
    company: "Global Inc",
    avatar: "/confident-business-woman.png",
    content:
      "Finally, a tool that understands context and creates meaningful summaries. The export features are exactly what we needed.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Team Lead",
    company: "DevStudio",
    avatar: "/developer-man.png",
    content:
      "The transcription accuracy is phenomenal, even with technical jargon. It's become an essential part of our workflow.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "HR Manager",
    company: "PeopleFirst",
    avatar: "/hr-professional.png",
    content:
      "Compliance and security features give us peace of mind. The structured format makes sharing with stakeholders effortless.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Consultant",
    company: "Advisory Group",
    avatar: "/consultant-man.jpg",
    content:
      "Client meetings are now properly documented and actionable. The sentiment analysis helps me understand meeting dynamics better.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Trusted by 10,000+ professionals
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Loved by teams worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              See how professionals across industries are transforming their meeting workflows
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-sm leading-relaxed text-foreground mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
