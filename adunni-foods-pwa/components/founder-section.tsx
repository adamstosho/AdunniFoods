"use client"

import { motion } from "framer-motion"
import { Award, Heart, Users } from "lucide-react"

export function FounderSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-08-08%20at%2014.04.57_a03fe5a9.jpg-QTaqzv5ALYz4byHlvNXSw2qZJ6Ur1N.jpeg"
                alt="Adunni Foods Founder - Professional chef in white coat with plantain chip products"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-background rounded-xl p-6 shadow-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">Meet Our Founder</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With a passion for authentic Nigerian flavors and a commitment to quality, our founder has dedicated
                years to perfecting the art of plantain chip making. From humble beginnings to becoming a trusted name
                in premium snacks.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Passion for Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Every batch is made with love and attention to detail, ensuring the perfect crunch and flavor.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border"
              >
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Award-Winning Recipe</h3>
                  <p className="text-sm text-muted-foreground">
                    Our unique blend of spices and traditional cooking methods creates an unforgettable taste.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border"
              >
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting local farmers and bringing authentic Nigerian flavors to families everywhere.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl border"
            >
              <blockquote className="text-foreground italic text-lg mb-3">
                "My mission is simple: to share the authentic taste of Nigeria with the world, one perfectly crafted
                plantain chip at a time."
              </blockquote>
              <cite className="text-sm text-muted-foreground font-medium">- Founder, Adunni Foods</cite>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
