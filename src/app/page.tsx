export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Admissions Case Manager
        </h1>

        <p className="mt-2 text-slate-600">
          Manage school applications, requirements and deadlines in one place.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            ADMISSIONS CASE
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Test Child
          </h2>

          <p className="mt-1 text-slate-600">
            Secondary school entry: September 2028
          </p>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Tiffin School
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Status
            </p>

            <p className="font-medium text-slate-900">
              Preparing
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-slate-900">
                Requirements
              </h4>

              <div className="mt-3 space-y-3">
                <p>☐ Check eligibility</p>
                <p>☐ Register for entrance test</p>
                <p>☐ Sit Stage 1</p>
                <p>☐ Complete subsequent assessment</p>
                <p>☐ Submit CAF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}