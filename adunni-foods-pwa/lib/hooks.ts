"use client"

import { useState, useEffect } from "react"
import { api, type StoreSettings } from "./api"
import { useAppStore } from "./store"

export function useSettings() {
    const { storeSettings, setStoreSettings } = useAppStore()
    const [settings, setSettings] = useState<StoreSettings | null>(storeSettings)
    const [loading, setLoading] = useState(!storeSettings)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchSettings = async () => {
            try {
                // If we already have settings in the store, we can skip initial loading
                if (!storeSettings) setLoading(true)
                
                const response = await api.getStoreSettings()
                if (mounted) {
                    if (response.success && response.data) {
                        setSettings(response.data)
                        setStoreSettings(response.data)
                    } else {
                        throw new Error(response.message || "Failed to load settings")
                    }
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err : new Error("Unknown error"))
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchSettings()

        return () => {
            mounted = false
        }
    }, [])

    return { settings, loading, error }
}
