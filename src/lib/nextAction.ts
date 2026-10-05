export type Requirement = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: "todo" | "done";
};

export type NextAction = {
  requirement: Requirement | null;
  label: string;
  message: string;
  urgency: "overdue" | "today" | "soon" | "upcoming" | "none";
};

function getDaysUntil(dateString: string) {
  const dueDate = new Date(`${dateString}T00:00:00Z`);

  const now = new Date();

  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const difference = dueDate.getTime() - today;

  return Math.round(difference / (1000 * 60 * 60 * 24));
}

export function getNextAction(
  requirements: Requirement[]
): NextAction {

  const unfinishedRequirements = requirements.filter(
    (requirement) => requirement.status === "todo"
  );

  if (unfinishedRequirements.length === 0) {
    return {
      requirement: null,
      label: "All caught up",
      message: "There are no outstanding actions.",
      urgency: "none",
    };
  }

  const requirementsWithDeadlines =
    unfinishedRequirements
      .filter(
        (requirement) => requirement.due_date !== null
      )
      .sort((a, b) =>
        a.due_date!.localeCompare(b.due_date!)
      );

  const nextRequirement =
    requirementsWithDeadlines[0] ??
    unfinishedRequirements[0];

  if (!nextRequirement.due_date) {
    return {
      requirement: nextRequirement,
      label: "Next action",
      message: "No deadline has been recorded.",
      urgency: "upcoming",
    };
  }

  const daysUntil =
    getDaysUntil(nextRequirement.due_date);

  if (daysUntil < 0) {
    const overdueBy = Math.abs(daysUntil);

    return {
      requirement: nextRequirement,
      label: "Overdue",
      message:
        overdueBy === 1
          ? "Overdue by 1 day"
          : `Overdue by ${overdueBy} days`,
      urgency: "overdue",
    };
  }

  if (daysUntil === 0) {
    return {
      requirement: nextRequirement,
      label: "Due today",
      message: "This action is due today.",
      urgency: "today",
    };
  }

  if (daysUntil <= 7) {
    return {
      requirement: nextRequirement,
      label: "Due soon",
      message:
        daysUntil === 1
          ? "Due tomorrow"
          : `Due in ${daysUntil} days`,
      urgency: "soon",
    };
  }

  return {
    requirement: nextRequirement,
    label: "Next action",
    message: `Due in ${daysUntil} days`,
    urgency: "upcoming",
  };
}