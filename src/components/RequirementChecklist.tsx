"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Requirement = {
  id: string;
  title: string;
  status: "todo" | "done";
};

type Props = {
  initialRequirements: Requirement[];
};

export default function RequirementChecklist({
  initialRequirements,
}: Props) {
  const [requirements, setRequirements] =
    useState(initialRequirements);

  async function toggleRequirement(
    requirement: Requirement
  ) {
    const newStatus =
      requirement.status === "done"
        ? "todo"
        : "done";

    const { error } = await supabase
      .from("requirements")
      .update({ status: newStatus })
      .eq("id", requirement.id);

    if (error) {
      alert(
        `Could not update requirement: ${error.message}`
      );
      return;
    }

    setRequirements((current) =>
      current.map((item) =>
        item.id === requirement.id
          ? { ...item, status: newStatus }
          : item
      )
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {requirements.map((requirement) => (
        <button
          key={requirement.id}
          onClick={() =>
            toggleRequirement(requirement)
          }
          className="block w-full rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
        >
          <span>
            {requirement.status === "done"
              ? "☑"
              : "☐"}
          </span>

          <span
            className={`ml-3 ${
              requirement.status === "done"
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {requirement.title}
          </span>
        </button>
      ))}
    </div>
  );
}