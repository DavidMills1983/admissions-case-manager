import Link from "next/link";
import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { getNextAction } from "@/lib/nextAction";
import { formatDate } from "@/lib/dates";
import { updateRequirementStatus } from "./actions";

export const dynamic = "force-dynamic";

type CasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CasePage({
  params,
}: CasePageProps) {

  const { id } = await params;

  const {
    data: admissionCase,
    error: caseError,
  } = await supabase
    .from("admission_cases")
    .select("*")
    .eq("id", id)
    .single();

  if (caseError || !admissionCase) {
    notFound();
  }

  const [
    childResult,
    schoolResult,
    requirementsResult,
  ] = await Promise.all([
    supabase
      .from("children")
      .select("*")
      .eq("id", admissionCase.child_id)
      .single(),

    supabase
      .from("schools")
      .select("*")
      .eq("id", admissionCase.school_id)
      .single(),

    supabase
      .from("requirements")
      .select("*")
      .eq("case_id", admissionCase.id)
      .order("due_date", {
        ascending: true,
        nullsFirst: false,
      }),
  ]);

  const child = childResult.data;
  const school = schoolResult.data;
  const requirements =
    requirementsResult.data ?? [];

  const nextAction =
    getNextAction(requirements);

  return (
    <main className="mx-auto max-w-4xl p-8">

      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline"
      >
        ← All admissions cases
      </Link>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          {child?.name}
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          {school?.name}
        </h1>

        <p className="mt-2 text-gray-600">
          {school?.local_authority}
          {" · "}
          {school?.school_type}
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          {nextAction.label}
        </p>

        {nextAction.requirement ? (
          <>
            <h2 className="mt-2 text-xl font-semibold">
              {
                nextAction
                  .requirement
                  .title
              }
            </h2>

            <p className="mt-2 text-gray-700">
              {nextAction.message}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Deadline:{" "}
              {formatDate(
                nextAction
                  .requirement
                  .due_date
              )}
            </p>
          </>
        ) : (
          <p className="mt-2 text-gray-700">
            {nextAction.message}
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Requirements
        </h2>

        <div className="mt-4 space-y-3">
          {requirements.map(
            (requirement) => (
              <div
                key={requirement.id}
                className="rounded-lg border p-5"
              >
                <div className="flex items-start justify-between gap-6">

                  <div>
                    <h3 className="font-semibold">
                      {requirement.title}
                    </h3>

                    {requirement.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {
                          requirement.description
                        }
                      </p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">
                      Deadline:{" "}
                      {formatDate(
                        requirement.due_date
                      )}
                    </p>
                  </div>

            <div className="flex flex-col items-end gap-3">

            <span
                className={
                requirement.status === "done"
                    ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                    : "rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800"
                }
            >
                {requirement.status}
            </span>

            <form
                action={
                updateRequirementStatus
                }
            >
                <input
                type="hidden"
                name="requirementId"
                value={requirement.id}
                />

                <input
                type="hidden"
                name="caseId"
                value={admissionCase.id}
                />

                <input
                type="hidden"
                name="newStatus"
                value={
                    requirement.status === "done"
                    ? "todo"
                    : "done"
                }
                />

                <button
                type="submit"
                className="text-sm font-medium text-blue-600 hover:underline"
                >
                {requirement.status === "done"
                    ? "Reopen"
                    : "Mark done"}
                </button>
            </form>

            </div>

                </div>
              </div>
            )
          )}
        </div>
      </section>

    </main>
  );
}