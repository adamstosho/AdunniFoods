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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Shield, User, Store, CreditCard, Truck } from "lucide-react"
import { api, type AdminProfile, type StoreSettings } from "@/lib/api"
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

const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  whatsappPhone: z.string().min(10, "Invalid phone number"),
  supportEmail: z.string().email("Invalid email"),
  bankName: z.string().min(2, "Bank name is required"),
  accountName: z.string().min(2, "Account name is required"),
  accountNumber: z.string().min(10, "Invalid account number"),
  deliveryFeeThreshold: z.number().min(0),
  baseDeliveryFee: z.number().min(0),
})

type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>

export function AdminSettings() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const credentialsForm = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
  })

  const settingsForm = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [profileRes, settingsRes] = await Promise.all([
          api.getAdminProfile(),
          api.getStoreSettings(),
        ])

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data)
        }

        if (settingsRes.success && settingsRes.data) {
          setStoreSettings(settingsRes.data)
          settingsForm.reset(settingsRes.data)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
        toast.error("Failed to load settings data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [settingsForm])

  const onCredentialsSubmit = async (data: CredentialsFormData) => {
    try {
      setSaving(true)
      const res = await api.updateAdminCredentials(data)
      if (res.success && res.data) {
        toast.success("Credentials updated successfully")
        setProfile((prev) => (prev ? { ...prev, username: res.data!.username } : prev))
        credentialsForm.reset({
          currentPassword: "",
          newUsername: res.data.username,
          newPassword: "",
          confirmNewPassword: "",
        })
      } else {
        throw new Error(res.message || "Failed to update credentials")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update credentials")
    } finally {
      setSaving(false)
    }
  }

  const onSettingsSubmit = async (data: StoreSettingsFormData) => {
    try {
      setSaving(true)
      const res = await api.updateStoreSettings(data)
      if (res.success && res.data) {
        toast.success("Store settings updated successfully")
        setStoreSettings(res.data)
      } else {
        throw new Error(res.message || "Failed to update store settings")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update store settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store configuration and account security.</p>
        </div>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Store Config
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-primary" />
                    General Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" {...settingsForm.register("storeName")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsappPhone">WhatsApp Phone (with country code, e.g. 2347030322419)</Label>
                    <Input id="whatsappPhone" {...settingsForm.register("whatsappPhone")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" {...settingsForm.register("supportEmail")} />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Banking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" {...settingsForm.register("bankName")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" {...settingsForm.register("accountName")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" {...settingsForm.register("accountNumber")} />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Settings */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="baseDeliveryFee">Base Delivery Fee (₦)</Label>
                      <Input
                        id="baseDeliveryFee"
                        type="number"
                        {...settingsForm.register("baseDeliveryFee", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="deliveryFeeThreshold">Free Delivery Threshold (₦)</Label>
                      <Input
                        id="deliveryFeeThreshold"
                        type="number"
                        {...settingsForm.register("deliveryFeeThreshold", { valueAsNumber: true })}
                      />
                      <p className="text-xs text-muted-foreground">Orders above this amount receive free delivery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="min-w-[150px]">
                {saving ? "Saving..." : "Save Store Settings"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="account">
          <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Account & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      disabled={saving}
                      {...credentialsForm.register("currentPassword")}
                      className={credentialsForm.formState.errors.currentPassword ? "border-destructive" : ""}
                    />
                    {credentialsForm.formState.errors.currentPassword && (
                      <p className="text-xs text-destructive">{credentialsForm.formState.errors.currentPassword.message}</p>
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
                      {...credentialsForm.register("newUsername")}
                      className={credentialsForm.formState.errors.newUsername ? "border-destructive" : ""}
                    />
                    {credentialsForm.formState.errors.newUsername && (
                      <p className="text-xs text-destructive">{credentialsForm.formState.errors.newUsername.message}</p>
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
                        {...credentialsForm.register("newPassword")}
                        className={credentialsForm.formState.errors.newPassword ? "border-destructive" : ""}
                      />
                      {credentialsForm.formState.errors.newPassword && (
                        <p className="text-xs text-destructive">{credentialsForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        autoComplete="new-password"
                        disabled={saving}
                        {...credentialsForm.register("confirmNewPassword")}
                        className={credentialsForm.formState.errors.confirmNewPassword ? "border-destructive" : ""}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      Requires current password for changes.
                    </p>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full justify-center sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {saving ? "Saving changes..." : "Save Credentials"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Admin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Username</p>
                  <p className="font-semibold">{profile?.username}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Admin since</p>
                  <p>
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

