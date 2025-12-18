"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, CheckCircle, Loader2, MessageSquare } from "lucide-react"
import { api, Review, ReviewStats } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set())

    useEffect(() => {
        async function fetchProductReviews() {
            try {
                setLoading(true)
                const response = await api.getPublicReviews({
                    type: "product",
                    productId,
                    limit: 10
                })
                if (response.success && response.data) {
                    setReviews(response.data.reviews)
                    setStats(response.data.stats)
                }
            } catch (error) {
                console.error("Failed to fetch product reviews:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProductReviews()
    }, [productId])

    const handleHelpful = async (reviewId: string) => {
        if (helpfulClicked.has(reviewId)) return
        try {
            await api.markReviewHelpful(reviewId)
            setHelpfulClicked(new Set([...helpfulClicked, reviewId]))
            setReviews(reviews.map(r =>
                r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
            ))
        } catch (error) {
            console.error("Failed to mark review helpful:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading reviews...</p>
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="font-semibold text-lg">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to review this product!</p>
                <Button variant="outline" asChild>
                    <a href="/reviews">Write a General Review</a>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats Summary Area */}
            {stats && (
                <div className="flex flex-wrap items-center gap-8 pb-8 border-b border-border">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-foreground">{stats.averageRating.toFixed(1)}</div>
                        <div className="flex gap-0.5 my-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground">{stats.totalReviews} Reviews</div>
                    </div>

                    <div className="flex-1 max-w-xs space-y-1">
                        {[5, 4, 3, 2, 1].map(r => {
                            const count = stats.ratingDistribution[r as 1 | 2 | 3 | 4 | 5] || 0;
                            const pct = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                            return (
                                <div key={r} className="flex items-center gap-2 text-xs">
                                    <span className="w-2">{r}</span>
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-4 text-muted-foreground">{count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Review List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="font-semibold">{review.customerName}</span>
                                {review.isVerifiedPurchase && (
                                    <Badge variant="secondary" className="h-5 text-[10px] bg-green-50 text-green-600 border-green-100 uppercase tracking-wider">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                    </Badge>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        {review.title && <div className="font-medium text-sm mb-1">{review.title}</div>}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">"{review.comment}"</p>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHelpful(review._id)}
                            disabled={helpfulClicked.has(review._id)}
                            className="h-7 px-2 text-xs gap-1.5 text-muted-foreground"
                        >
                            <ThumbsUp className={`w-3 h-3 ${helpfulClicked.has(review._id) ? "fill-primary text-primary" : ""}`} />
                            Helpful ({review.helpfulCount})
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
