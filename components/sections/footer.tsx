import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "API", href: "/api" },
    { name: "Integrations", href: "/integrations" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "Status", href: "/status" },
    { name: "Community", href: "/community" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
    { name: "Cookies", href: "/cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Stay updated with TalkToText Pro</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest features, tips, and productivity insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">TT</span>
                </div>
                <span className="font-bold text-lg">TalkToText Pro</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Transform your meeting recordings into professional notes with AI-powered transcription and analysis.
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com" aria-label="GitHub">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://twitter.com" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://linkedin.com" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="mailto:hello@talktotextpro.com" aria-label="Email">
                    <Mail className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 TalkToText Pro. All rights reserved.</p>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-0">Made with ❤️ for productive teams</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
