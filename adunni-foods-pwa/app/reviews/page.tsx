"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, Send, MapPin, User, Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react"
import { api, type Review, type ReviewStats, type CreateReviewInput } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Navigation } from "@/components/navigation"
import { MobileNavigation } from "@/components/mobile-navigation"
import { CartSidebar } from "@/components/cart-sidebar"
import Link from "next/link"

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [rating, setRating] = useState(5)
    const [hoverRating, setHoverRating] = useState(0)

    // Form state
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerLocation: "",
        title: "",
        comment: "",
    })

    useEffect(() => {
        fetchReviews()
        fetchStats()
    }, [])

    const fetchReviews = async () => {
        try {
            const response = await api.getReviews({ type: "store", status: "approved" })
            if (response.success && response.data) {
                setReviews(response.data.reviews)
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await api.getReviewStats({ type: "store" })
            if (response.success && response.data) {
                setStats(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.customerName || !formData.customerEmail || !formData.comment) {
            toast.error("Please fill in all required fields")
            return
        }

        setSubmitting(true)
        try {
            const reviewInput: CreateReviewInput = {
                ...formData,
                type: "store",
                rating,
            }
            const response = await api.createReview(reviewInput)
            if (response.success) {
                toast.success("Review submitted! It will be visible after approval.")
                setFormData({
                    customerName: "",
                    customerEmail: "",
                    customerLocation: "",
                    title: "",
                    comment: "",
                })
                setRating(5)
            }
        } catch (error) {
            toast.error("Failed to submit review. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navigation />

            {/* Hero Header */}
            <div className="bg-primary/5 pt-32 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/" className="inline-flex items-center text-primary text-sm font-medium mb-6 hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">Customer Reviews</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We value your feedback! Read what others are saying about Adunni Foods or share your own experience.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column: Stats & Form */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Stats Summary */}
                        <Card className="border-primary/20 bg-primary/5 shadow-none overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Store Rating</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-5xl font-bold text-primary">
                                        {stats?.averageRating.toFixed(1) || "5.0"}
                                    </div>
                                    <div>
                                        <div className="flex mb-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-5 h-5 ${s <= Math.round(stats?.averageRating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{stats?.totalReviews || 0} Reliable Reviews</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((r) => {
                                        const count = stats?.distribution[r as 1 | 2 | 3 | 4 | 5] || 0
                                        const percentage = stats?.totalReviews ? (count / stats.totalReviews) * 100 : (r === 5 ? 100 : 0)
                                        return (
                                            <div key={r} className="flex items-center gap-3 text-sm">
                                                <span className="w-3 font-medium">{r}</span>
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-muted-foreground">{count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submission Form */}
                        <Card className="shadow-lg border-2 border-primary/10">
                            <CardHeader>
                                <CardTitle>Write a Review</CardTitle>
                                <CardDescription>Share your experience with our products and service.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label>Your Rating *</Label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                    onMouseEnter={() => setHoverRating(s)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(s)}
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${(hoverRating || rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="customerName">Full Name *</Label>
                                            <Input
                                                id="customerName"
                                                placeholder="e.g. John Doe"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="customerEmail">Email Address *</Label>
                                            <Input
                                                id="customerEmail"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.customerEmail}
                                                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="customerLocation">Location (Optional)</Label>
                                        <Input
                                            id="customerLocation"
                                            placeholder="e.g. Lagos, Nigeria"
                                            value={formData.customerLocation}
                                            onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Review Title (Optional)</Label>
                                        <Input
                                            id="title"
                                            placeholder="Summarize your experience"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="comment">Your Review *</Label>
                                        <Textarea
                                            id="comment"
                                            placeholder="What did you like or dislike?"
                                            rows={4}
                                            value={formData.comment}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit Review
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                        Reviews are strictly moderated for authenticity.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Reviews List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                Latest Feedback
                            </h2>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="h-40 bg-muted/20" />
                                    </Card>
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
                                <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                <h3 className="font-semibold text-xl">No reviews yet</h3>
                                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {reviews.map((review) => (
                                    <Card key={review._id} className="hover:shadow-md transition-shadow group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-lg mb-2">{review.title || "Untithed Review"}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                                                "{review.comment}"
                                            </p>

                                            <div className="flex items-center justify-between border-t pt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{review.customerName}</p>
                                                        {review.customerLocation && (
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {review.customerLocation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {review.isVerifiedPurchase && (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 hidden sm:flex">
                                                            <ShieldCheck className="w-3 h-3" />
                                                            Verified
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CartSidebar />
            <MobileNavigation />
        </main>
    )
}
