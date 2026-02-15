"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type TinnitusData = {
  screenings: number
  assessments: number
  treatments: number
  outcomes: number
}

export function useTinnitus() {
  const [data, setData] = useState<TinnitusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
          if (isMounted) {
            setLoading(false)
            setError("Please sign in to view tinnitus data.")
          }
          return
        }

        const [screenings, assessments, treatments, outcomes] = await Promise.all([
          supabase
            .from("tinnitus_screenings")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("tinnitus_assessments")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("tinnitus_treatments")
            .select("id", { count: "exact", head: true }),
          supabase.from("outcome_measures").select("id", { count: "exact", head: true }),
        ])

        if (isMounted) {
          setData({
            screenings: screenings.count ?? 0,
            assessments: assessments.count ?? 0,
            treatments: treatments.count ?? 0,
            outcomes: outcomes.count ?? 0,
          })
          setLoading(false)
        }
      } catch (loadError) {
        if (isMounted) {
          setError("Unable to load tinnitus data.")
          setLoading(false)
        }
        console.error("Error in useTinnitus:", loadError)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, loading, error }
}
