"use client"

import { motion } from "framer-motion"
import { Truck, Shield, Clock, Star, Leaf, Phone } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery within Lagos, nationwide shipping available",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee or your money back",
  },
  {
    icon: Clock,
    title: "Always Fresh",
    description: "Made to order to ensure maximum freshness and crunch",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Carefully selected plantains and authentic Nigerian spices",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description: "No artificial preservatives, colors, or flavors added",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "WhatsApp support available anytime for your convenience",
  },
]

export function EnhancedFeatures() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">Why Choose Adunni Foods?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering the best plantain chips experience with unmatched quality and service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-background p-6 rounded-xl border hover:shadow-lg transition-all duration-300 hover:border-primary/20 h-full">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
