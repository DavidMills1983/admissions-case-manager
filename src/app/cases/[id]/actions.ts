"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function updateRequirementStatus(
  formData: FormData
) {
  const requirementId =
    formData.get("requirementId");

  const caseId =
    formData.get("caseId");

  const newStatus =
    formData.get("newStatus");

  if (
    typeof requirementId !== "string" ||
    typeof caseId !== "string" ||
    (
      newStatus !== "todo" &&
      newStatus !== "done"
    )
  ) {
    throw new Error(
      "Invalid requirement update"
    );
  }

  const { error } = await supabase
    .from("requirements")
    .update({
      status: newStatus,
    })
    .eq("id", requirementId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(
    `/cases/${caseId}`
  );

  revalidatePath("/");
}