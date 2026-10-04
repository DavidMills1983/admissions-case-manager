import { supabase } from "@/lib/supabase";
import RequirementChecklist from "@/components/RequirementChecklist";

const CASE_ID =
  "11111111-1111-1111-1111-111111111111";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: admissionCase, error: caseError } =
    await supabase
      .from("admission_cases")
      .select("*")
      .eq("id", CASE_ID)
      .single();

  if (caseError || !admissionCase) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Could not load admissions case
        </h1>

        <p className="mt-4 text-red-600">
          {caseError?.message}
        </p>
      </main>
    );
  }

  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", admissionCase.child_id)
    .single();

  const { data: school } = await supabase
    .from("schools")
    .select("*")
    .eq("id", admissionCase.school_id)
    .single();

  const { data: requirements } = await supabase
    .from("requirements")
    .select("*")
    .eq("case_id", CASE_ID)
    .order("title");

  const completed =
    requirements?.filter(
      (requirement) => requirement.status === "done"
    ).length ?? 0;

  const total = requirements?.length ?? 0;

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Admissions Case Manager
        </h1>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            ADMISSIONS CASE
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {child?.name}
          </h2>

          <p className="mt-1 text-slate-600">
            Secondary school entry: September{" "}
            {child?.entry_year}
          </p>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-xl font-semibold text-slate-900">
              {school?.name}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Status
            </p>

            <p className="font-medium capitalize text-slate-900">
              {admissionCase.status}
            </p>

            <p className="mt-4 text-sm text-slate-600">
              Progress: {completed} / {total} complete
            </p>

            <div className="mt-6">
              <h4 className="font-semibold text-slate-900">
                Requirements
              </h4>

              <RequirementChecklist
              initialRequirements={
                requirements?.map((requirement) => ({
                  id: requirement.id,
                  title: requirement.title,
                  status: requirement.status as "todo" | "done",
                })) ?? []
              }
            />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}