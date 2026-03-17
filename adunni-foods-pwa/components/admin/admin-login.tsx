"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const response = await api.login(data.username, data.password)

      if (response.success && response.data?.token) {
        api.setToken(response.data.token)
        toast.success("Login successful!")
        router.push("/admin/dashboard")
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-amber-50 via-background to-cyan-50 px-4 py-10">
      {/* Decorative lights (subtle, brand-aligned) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-28 w-[520px] bg-linear-to-r from-transparent via-primary/10 to-transparent blur-3xl" />

      <div className="w-full max-w-md">
        <Card className="border-border/60 bg-card/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80 animate-in fade-in zoom-in-95 duration-300">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background/60 shadow-sm ring-1 ring-border/60">
            <Image
              src="/adunnilogo.png"
              alt="Adunni Foods logo"
              width={64}
              height={64}
              priority
              className="h-14 w-14 object-contain rounded-xl"
            />
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">Admin Sign In</CardTitle>
            <p className="text-sm text-muted-foreground">
              Secure access to your dashboard
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Only authorized staff should sign in.</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  aria-invalid={!!errors.username}
                  className={errors.username ? "border-destructive focus-visible:ring-destructive/30" : ""}
                  disabled={isLoading}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    className={errors.password ? "border-destructive pr-10 focus-visible:ring-destructive/30" : "pr-10"}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-md hover:shadow-primary/15 active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="pt-1 text-center text-xs text-muted-foreground">
              <Link href="/" className="underline-offset-4 hover:underline">
                Back to website
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
