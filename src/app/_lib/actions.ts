"use server";

import { asc, eq, inArray, not } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidateTag, unstable_noStore } from "next/cache";
import { db } from "@/db/index";
import { takeFirstOrThrow } from "@/db/utils";

import { getErrorMessage } from "@/lib/handle-error";

import type { CreateTaskSchema, UpdateTaskSchema } from "./validations";

export async function createTask(input: CreateTaskSchema) {
  unstable_noStore();
  try {
    await db.transaction(async (tx) => {
      const newTask = await tx
        .insert(tasks)
        .values({
          code: `TASK-${customAlphabet("0123456789", 4)()}`,
          title: input.title,
          status: input.status,
          label: input.label,
          priority: input.priority,
        })
        .returning({
          id: tasks.id,
        })
        .then(takeFirstOrThrow);
    });

    revalidateTag("tasks");
    revalidateTag("task-status-counts");
    revalidateTag("task-priority-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateTask(input: UpdateTaskSchema & { id: string }) {
  unstable_noStore();
  try {
    const data = await db
      .update(tasks)
      .set({
        title: input.title,
        label: input.label,
        status: input.status,
        priority: input.priority,
      })
      .where(eq(tasks.id, input.id))
      .returning({
        status: tasks.status,
        priority: tasks.priority,
      })
      .then(takeFirstOrThrow);

    revalidateTag("tasks");
    if (data.status === input.status) {
      revalidateTag("task-status-counts");
    }
    if (data.priority === input.priority) {
      revalidateTag("task-priority-counts");
    }

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function updateTasks(input: {
  ids: string[];
  label?: Task["label"];
  status?: Task["status"];
  priority?: Task["priority"];
}) {
  unstable_noStore();
  try {
    const data = await db
      .update(tasks)
      .set({
        label: input.label,
        status: input.status,
        priority: input.priority,
      })
      .where(inArray(tasks.id, input.ids))
      .returning({
        status: tasks.status,
        priority: tasks.priority,
      })
      .then(takeFirstOrThrow);

    revalidateTag("tasks");
    if (data.status === input.status) {
      revalidateTag("task-status-counts");
    }
    if (data.priority === input.priority) {
      revalidateTag("task-priority-counts");
    }

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTask(input: { id: string }) {
  unstable_noStore();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(eq(tasks.id, input.id));

      // Create a new task for the deleted one
      await tx.insert(tasks).values(generateRandomTask());
    });

    revalidateTag("tasks");
    revalidateTag("task-status-counts");
    revalidateTag("task-priority-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTasks(input: { ids: string[] }) {
  unstable_noStore();
  try {
    await db.transaction(async (tx) => {
      await tx.delete(tasks).where(inArray(tasks.id, input.ids));

      // Create new tasks for the deleted ones
      await tx.insert(tasks).values(input.ids.map(() => generateRandomTask()));
    });

    revalidateTag("tasks");
    revalidateTag("task-status-counts");
    revalidateTag("task-priority-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
