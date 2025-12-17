"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Shield, User } from "lucide-react"
import { api, type AdminProfile } from "@/lib/api"
import { toast } from "sonner"

const credentialsSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newUsername: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  })

type CredentialsFormData = z.infer<typeof credentialsSchema>

export function AdminSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        const res = await api.getAdminProfile()
        if (res.success && res.data) {
          setProfile(res.data)
        } else {
          throw new Error(res.message || "Failed to load admin profile")
        }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error)
        toast.error("Failed to load admin settings")
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [])

  const onSubmit = async (data: CredentialsFormData) => {
    try {
      setSaving(true)
      const res = await api.updateAdminCredentials(data)
      if (res.success && res.data) {
        toast.success("Credentials updated successfully")
        setProfile((prev) => (prev ? { ...prev, username: res.data!.username } : prev))
        reset({
          currentPassword: "",
          newUsername: res.data.username,
          newPassword: "",
          confirmNewPassword: "",
        })
      } else {
        throw new Error(res.message || "Failed to update credentials")
      }
    } catch (error: any) {
      console.error("Failed to update credentials:", error)
      const message =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to update credentials")
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your admin account credentials and security.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
        {/* Credentials Card */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Account & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  disabled={saving}
                  {...register("currentPassword")}
                  className={errors.currentPassword ? "border-destructive" : ""}
                />
                {errors.currentPassword && (
                  <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label htmlFor="newUsername">New Username</Label>
                <Input
                  id="newUsername"
                  autoComplete="username"
                  defaultValue={profile?.username}
                  disabled={saving}
                  {...register("newUsername")}
                  className={errors.newUsername ? "border-destructive" : ""}
                />
                {errors.newUsername && (
                  <p className="text-xs text-destructive">{errors.newUsername.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={saving}
                    {...register("newPassword")}
                    className={errors.newPassword ? "border-destructive" : ""}
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={saving}
                    {...register("confirmNewPassword")}
                    className={errors.confirmNewPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  For security, you will need your current password to make changes.
                </p>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full justify-center sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? "Saving changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Admin Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {loadingProfile ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </div>
            ) : profile ? (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Username</p>
                  <p className="font-semibold">{profile.username}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Admin since</p>
                  <p>
                    {new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-destructive">Failed to load admin profile.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

