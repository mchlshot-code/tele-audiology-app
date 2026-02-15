export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Privacy Policy</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Your privacy matters
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              This policy explains what data we collect, why we collect it, and how
              we protect it.
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <p>
              We collect information you provide during screenings, consultations,
              and account creation to personalize hearing care.
            </p>
            <p>
              We store your data securely and only share it with authorized clinical
              staff when necessary to provide care.
            </p>
            <p>
              You can request data access or deletion by contacting our support
              team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
