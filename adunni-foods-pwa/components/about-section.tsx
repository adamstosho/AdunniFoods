"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Heart, Truck, Award } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "Made with fresh plantains and natural ingredients, no artificial preservatives",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Each batch is carefully prepared with traditional Nigerian recipes",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Fresh chips delivered to your door within 24 hours",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Award-winning taste that keeps customers coming back",
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <Badge variant="secondary" className="mb-4">
              Our Story
            </Badge>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-6">
              Our Journey: From Passion to Excellence
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg mb-8 leading-relaxed">
              <p>
                Adunni Foods is a proudly Nigerian food brand founded by Zimbiat Mojirayo Toyin, an entrepreneur and certified chef from Ilorin, Kwara State. Driven by a deep passion for healthy, well-prepared meals, what started as a small idea in 2019 evolved into a focused venture.
              </p>
              <p>
                In 2022, we introduced our naturally made plantain chips, and by 2023, Adunni Foods had grown into a fully committed business built on quality, consistency, and trust. Our focus is simple: producing natural, hygienic, and delicious plantain chips that people can enjoy without compromise.
              </p>
              <p>
                Over the years, we've grown steadily, serving customers across Nigeria and beyond. Through entrepreneurship programmes, awards, and exhibitions, we continue to build a reputation for excellence, delivering healthy, affordable options while putting customer satisfaction first.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-none bg-muted/50">
                  <CardContent className="p-4">
                    <feature.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/our-story-main.png"
                alt="Adunni Foods - Natural Plantain Chips Production"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
