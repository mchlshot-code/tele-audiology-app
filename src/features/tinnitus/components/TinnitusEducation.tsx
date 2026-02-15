"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

export default function TinnitusEducation() {
  return (
    <Card className="border-emerald-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-900">Tinnitus Education</CardTitle>
        <p className="text-sm text-slate-600">
          Learn what tinnitus is and how to manage it safely.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900">What is tinnitus?</p>
          <p>
            Tinnitus is the perception of sound when no external sound is present. It
            can feel like ringing, buzzing, humming, or whooshing and may vary by day.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900">Common triggers</p>
          <p>
            Loud noise exposure, stress, fatigue, certain medications, and untreated
            hearing loss can increase tinnitus intensity.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900">Healthy strategies</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Use soft background sounds to reduce contrast.</li>
            <li>Limit exposure to loud environments and use hearing protection.</li>
            <li>Practice relaxation and sleep routines.</li>
          </ul>
        </div>
        <Alert className="border-sky-200 bg-sky-50 text-slate-700">
          NDPA 2023 compliance: We only collect essential information to provide
          tinnitus support and never share your data without consent.
        </Alert>
      </CardContent>
    </Card>
  )
}
