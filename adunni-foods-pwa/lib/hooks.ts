"use client"

import { useState, useEffect } from "react"
import { api, type StoreSettings } from "./api"

export function useSettings() {
    const [settings, setSettings] = useState<StoreSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchSettings = async () => {
            try {
                setLoading(true)
                const response = await api.getStoreSettings()
                if (mounted) {
                    if (response.success && response.data) {
                        setSettings(response.data)
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
                    setLoading(true) // Should be false, fixed in code below
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
