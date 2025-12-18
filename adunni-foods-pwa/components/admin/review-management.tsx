"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Star,
    Search,
    CheckCircle2,
    XCircle,
    Trash2,
    User,
    Calendar,
    MessageSquare,
    MoreVertical,
} from "lucide-react"
import { api, type Review, type ReviewStatus, type ReviewType } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ReviewManagement() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<{
        status: ReviewStatus | "all"
        type: ReviewType | "all"
    }>({
        status: "all",
        type: "all",
    })
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchReviews()
    }, [filter])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const params: any = {}
            if (filter.status !== "all") params.status = filter.status
            if (filter.type !== "all") params.type = filter.type

            const response = await api.getReviews(params)
            if (response.success && response.data) {
                setReviews(response.data.reviews)
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error)
            toast.error("Failed to load reviews")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: ReviewStatus) => {
        try {
            const response = await api.updateReviewStatus(id, status)
            if (response.success) {
                toast.success(`Review ${status} successfully`)
                setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r))
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review permanently?")) return
        try {
            const response = await api.deleteReview(id)
            if (response.success) {
                toast.success("Review deleted")
                setReviews(prev => prev.filter(r => r._id !== id))
            }
        } catch (error) {
            toast.error("Failed to delete review")
        }
    }

    const filteredReviews = reviews.filter(r =>
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const getStatusBadge = (status: ReviewStatus) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
            case "rejected":
                return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
            default:
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-heading font-bold text-3xl text-foreground">Review Management</h1>
                    <p className="text-muted-foreground">Approve, reject, or manage customer feedback.</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search reviews..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={filter.status}
                                onValueChange={(val) => setFilter(prev => ({ ...prev, status: val as any }))}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filter.type}
                                onValueChange={(val) => setFilter(prev => ({ ...prev, type: val as any }))}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="store">Store</SelectItem>
                                    <SelectItem value="product">Product</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-12 text-center text-muted-foreground">Loading reviews...</div>
                        ) : filteredReviews.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground border rounded-lg border-dashed">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No reviews found matching your criteria.
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <Card key={review._id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="p-4 flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-medium uppercase text-muted-foreground px-2 py-0.5 bg-muted rounded">
                                                        {review.type}
                                                    </span>
                                                </div>
                                                {getStatusBadge(review.status)}
                                            </div>

                                            <h3 className="font-bold text-lg mb-1">{review.title || "No Title"}</h3>
                                            <p className="text-muted-foreground text-sm mb-4 italic">"{review.comment}"</p>

                                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    <span>{review.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{format(new Date(review.createdAt), "PPP")}</span>
                                                </div>
                                                {review.isVerifiedPurchase && (
                                                    <div className="flex items-center gap-1 text-green-600 font-medium">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Verified Purchase</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 p-4 flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l w-full md:w-auto min-w-[160px]">
                                            {review.status !== "approved" && (
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => handleUpdateStatus(review._id, "approved")}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                            )}
                                            {review.status !== "rejected" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                                    onClick={() => handleUpdateStatus(review._id, "rejected")}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="w-full">
                                                        <MoreVertical className="w-4 h-4 mr-2" />
                                                        Actions
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600"
                                                        onClick={() => handleDelete(review._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Permanently
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
