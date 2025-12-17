"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Kemi Adebayo",
      location: "Lagos",
      rating: 5,
      text: "The best plantain chips I've ever tasted! Reminds me of my grandmother's cooking. The delivery was super fast too.",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XtmcsusgA7KJHACxzTZSMRWTdFhXjp.png",
    },
    {
      name: "Tunde Okafor",
      location: "Abuja",
      rating: 5,
      text: "Amazing quality and taste. I order these for my family every week. The spicy variety is my favorite!",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XtmcsusgA7KJHACxzTZSMRWTdFhXjp.png",
    },
    {
      name: "Funmi Balogun",
      location: "Ibadan",
      rating: 5,
      text: "Perfect snack for movie nights. Crispy, flavorful, and made with love. Highly recommend Adunni Foods!",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XtmcsusgA7KJHACxzTZSMRWTdFhXjp.png",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Customer Reviews
          </Badge>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary mb-4" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
