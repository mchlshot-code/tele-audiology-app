export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Tele-Audiology</p>
              <p className="text-xs text-slate-500">Nigeria</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <button className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700">
              Sign in
            </button>
            <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Book a screening
            </button>
          </div>
        </header>

        <main className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Remote hearing care for every state
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Accessible hearing care with secure tele-audiology and fast triage.
            </h1>
            <p className="text-base text-slate-600 sm:text-lg">
              Connect with certified audiologists, complete remote screenings, and purchase care
              bundles in minutes. Designed for Nigerian families and clinics.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Average response time</p>
                <p className="text-2xl font-semibold text-sky-700">15 minutes</p>
                <p className="text-xs text-slate-500">Triage queue updates in real time</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Starting from</p>
                <p className="text-2xl font-semibold text-emerald-700">₦8,500</p>
                <p className="text-xs text-slate-500">Remote screening & care plan</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white">
                Start triage
              </button>
              <button className="rounded-full border border-sky-200 px-6 py-3 text-sm font-semibold text-sky-700">
                View care bundles
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-sky-600">Auth</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Secure patient access</h2>
              <p className="mt-2 text-sm text-slate-600">
                Passwordless sign-in and role-based access for clinicians and families.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-emerald-600">Triage</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Smart hearing intake</h2>
              <p className="mt-2 text-sm text-slate-600">
                Symptom forms that prioritize urgent cases and streamline follow-ups.
              </p>
            </div>
            <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-sky-600">Ecommerce</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Care bundle payments</h2>
              <p className="mt-2 text-sm text-slate-600">
                Transparent pricing in naira with instant receipts and plan summaries.
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-emerald-600">Insights</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Progress tracking</h2>
              <p className="mt-2 text-sm text-slate-600">
                Clinician notes, hearing results, and follow-up reminders in one place.
              </p>
            </div>
          </section>
        </main>

        <section className="mt-16 grid gap-6 rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-slate-900">
              Built for mobile-first care journeys
            </h3>
            <p className="text-sm text-slate-600">
              Responsive layouts ensure every patient can complete screenings and appointments from
              any device.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              24/7
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Always-on support</p>
              <p className="text-xs text-slate-500">Secure chat and appointment reminders</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
