"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Loader2, ArrowRight } from "lucide-react"
import { api, Review } from "@/lib/api"
import Link from "next/link"

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  // Default fallback reviews if none are approved in the DB yet
  const fallbacks = [
    {
      customerName: "Kemi Adebayo",
      customerLocation: "Lagos",
      rating: 5,
      comment: "The best plantain chips I've ever tasted! Reminds me of my grandmother's cooking. The delivery was super fast too.",
    },
    {
      customerName: "Tunde Okafor",
      customerLocation: "Abuja",
      rating: 5,
      comment: "Amazing quality and taste. I order these for my family every week. The spicy variety is my favorite!",
    },
    {
      customerName: "Funmi Balogun",
      customerLocation: "Ibadan",
      rating: 5,
      comment: "Perfect snack for movie nights. Crispy, flavorful, and made with love. Highly recommend Adunni Foods!",
    },
  ]

  useEffect(() => {
    async function fetchTopReviews() {
      try {
        setLoading(true)
        const response = await api.getPublicReviews({
          type: "store",
          limit: 3,
        })
        if (response.success && response.data && response.data.reviews.length > 0) {
          setReviews(response.data.reviews)
        } else {
          // If no reviews in DB, don't set anything, the component will use fallbacks
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTopReviews()
  }, [])

  const displayReviews = reviews.length > 0 ? reviews : fallbacks

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

        {loading && reviews.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayReviews.map((testimonial: any, index) => (
                <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300 border-border/50">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed italic">
                      "{testimonial.comment || testimonial.text}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {testimonial.customerName?.charAt(0) || testimonial.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {testimonial.customerName || testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.customerLocation || testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline group"
              >
                View all reviews
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
