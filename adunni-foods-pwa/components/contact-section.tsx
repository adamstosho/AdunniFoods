"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+234 814 466 5646",
      action: "tel:+2348144665646",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "adunnifoods8@gmail.com",
      action: "mailto:adunnifoods8@gmail.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "Chat with us",
      action: "https://wa.me/2348144665646",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Lagos, Nigeria",
      action: "#",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Get in Touch
          </Badge>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about our products or want to place a custom order? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                <p className="text-muted-foreground mb-4">{info.details}</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <a href={info.action} target={info.action.startsWith("http") ? "_blank" : undefined}>
                    Contact
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <a
              href="https://wa.me/2348144665646?text=Hello! I'm interested in your plantain chips."
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start WhatsApp Chat
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
