"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams",
    price: "$9",
    period: "per month",
    yearlyPrice: "$90",
    features: [
      "Up to 10 hours of transcription per month",
      "Basic AI summarization",
      "PDF & Word export",
      "Email support",
      "Standard security",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: "$29",
    period: "per month",
    yearlyPrice: "$290",
    features: [
      "Up to 50 hours of transcription per month",
      "Advanced AI analysis & insights",
      "All export formats",
      "Priority support",
      "Team collaboration tools",
      "Meeting analytics",
      "Custom templates",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: "Custom",
    period: "pricing",
    yearlyPrice: null,
    features: [
      "Unlimited transcription",
      "Custom AI models",
      "Advanced security & compliance",
      "Dedicated account manager",
      "API access",
      "Single sign-on (SSO)",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-32">
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
              Simple, transparent pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Choose the perfect plan for your team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Start with a free 14-day trial. No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-9 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`glass h-full hover:shadow-lg transition-all duration-300 ${
                    plan.popular ? "ring-2 ring-primary/20 hover:-translate-y-1" : "hover:-translate-y-1"
                  }`}
                >
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && <span className="ml-1 text-sm text-muted-foreground">/{plan.period}</span>}
                      </div>
                      {plan.yearlyPrice && (
                        <p className="text-xs text-muted-foreground mt-1">${plan.yearlyPrice}/year (save 17%)</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-4 w-4 text-primary mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                      <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="glass rounded-2xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Frequently asked questions</h3>
              <p className="text-muted-foreground">
                Can't find the answer you're looking for? Contact our support team.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How does the free trial work?</h4>
                <p className="text-sm text-muted-foreground">
                  Start with a 14-day free trial of our Professional plan. No credit card required. You can cancel
                  anytime during the trial period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll
                  prorate your billing.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">What file formats do you support?</h4>
                <p className="text-sm text-muted-foreground">
                  We support MP3, WAV, M4A, and most common audio formats. Video files (MP4, MOV) are also supported for
                  audio extraction.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use bank-level encryption and are compliant with GDPR, SOC2, and other security
                  standards. Your data is never shared with third parties.
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
