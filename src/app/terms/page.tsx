export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-emerald-50">
      <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Terms of Service</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Using Tele-Audiology Nigeria
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              These terms describe how to use the platform and what you can expect
              from us.
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <p>
              This platform provides educational content and screening tools. It does
              not replace professional medical advice.
            </p>
            <p>
              By using the service, you agree to provide accurate information and
              follow any clinical guidance communicated through the platform.
            </p>
            <p>
              We may update these terms to improve safety and service quality. The
              latest version will always be available here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
