import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getNextAction } from "@/lib/nextAction";
import { formatDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: admissionCases, error } =
    await supabase
      .from("admission_cases")
      .select("*")
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Could not load admissions cases
        </h1>

        <p className="mt-4 text-red-600">
          {error.message}
        </p>
      </main>
    );
  }

  const casesWithDetails = await Promise.all(
    (admissionCases ?? []).map(
      async (admissionCase) => {

        const [
          childResult,
          schoolResult,
          requirementsResult,
        ] = await Promise.all([
          supabase
            .from("children")
            .select("*")
            .eq(
              "id",
              admissionCase.child_id
            )
            .single(),

          supabase
            .from("schools")
            .select("*")
            .eq(
              "id",
              admissionCase.school_id
            )
            .single(),

          supabase
            .from("requirements")
            .select("*")
            .eq(
              "case_id",
              admissionCase.id
            )
            .order("due_date", {
              ascending: true,
              nullsFirst: false,
            }),
        ]);

        return {
          admissionCase,
          child: childResult.data,
          school: schoolResult.data,
          requirements:
            requirementsResult.data ?? [],
        };
      }
    )
  );

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">
        Admissions cases
      </h1>

      <p className="mt-2 text-gray-600">
        Track applications, deadlines and next actions.
      </p>

      <div className="mt-8 space-y-4">
        {casesWithDetails.map(
          ({
            admissionCase,
            child,
            school,
            requirements,
          }) => {

            const nextAction =
              getNextAction(requirements);

            return (
              <Link
                key={admissionCase.id}
                href={`/cases/${admissionCase.id}`}
                className="block rounded-xl border p-6 transition hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {school?.name ??
                        "Unknown school"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {child?.name ??
                        "Unknown child"}
                    </p>
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {admissionCase.status}
                  </span>
                </div>

                <div className="mt-5 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">
                    {nextAction.label}
                  </p>

                  {nextAction.requirement ? (
                    <>
                      <p className="mt-1 font-medium">
                        {
                          nextAction
                            .requirement.title
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {nextAction.message}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Deadline:{" "}
                        {formatDate(
                          nextAction
                            .requirement
                            .due_date
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">
                      {nextAction.message}
                    </p>
                  )}
                </div>
              </Link>
            );
          }
        )}
      </div>
    </main>
  );
}