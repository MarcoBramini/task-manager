import Task, { TaskState } from "./models/Task";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function getFilteredTasks(filterId) {
  const response = await fetch(
    "/task-manager/apis/tasks?filter=" +
      encodeURIComponent(filterId) +
      "&timezone=" +
      encodeURIComponent(dayjs.tz.guess())
  );

  const responseBody = await response.json();

  const tasks = [];
  for (let jsonTask of responseBody) {
    tasks.push(
      new Task(
        jsonTask.id,
        jsonTask.description,
        jsonTask.deadline,
        jsonTask.isImportant,
        jsonTask.isPrivate,
        TaskState.OK,
        jsonTask.isCompleted,
        jsonTask.userId
      )
    );
  }

  return tasks;
}

export async function createTask(newTask) {
  const response = await fetch("/task-manager/apis/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description: newTask.description,
      deadline: newTask.deadline,
      isImportant: newTask.isImportant,
      isPrivate: newTask.isPrivate,
    }),
  });

  const responseBody = await response.json();

  return responseBody;
}

export async function updateTask(updatedTask) {
  const response = await fetch(
    "/task-manager/apis/tasks/" + encodeURIComponent(updatedTask.id),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: updatedTask.description,
        deadline: updatedTask.deadline,
        isImportant: updatedTask.isImportant,
        isPrivate: updatedTask.isPrivate,
        isCompleted: updatedTask.isCompleted,
      }),
    }
  );

  const responseBody = await response.json();

  return responseBody.updatedTaskId;
}

export async function deleteTask(taskId) {
  return await fetch("/task-manager/apis/tasks/" + encodeURIComponent(taskId), {
    method: "DELETE",
  });
}

export async function completeTask(taskId, isCompleted) {
  const response = await fetch(
    "/task-manager/apis/tasks/" + encodeURIComponent(taskId),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCompleted: isCompleted,
      }),
    }
  );

  const responseBody = await response.json();

  return responseBody.updatedTaskId;
}

export async function loginUser(credentials) {
  const response = await fetch("/task-manager/apis/sessions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.email,
      password: credentials.password,
    }),
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    throw new Error(responseBody.message);
  }

  return responseBody;
}

export async function getCurrentUser() {
  const response = await fetch("/task-manager/apis/sessions/current", {
    method: "GET",
  });

  const responseBody = await response.json();

  if (response.status !== 200) {
    throw new Error(responseBody);
  }

  return responseBody.currentUser;
}

export async function logoutUser() {
  const response = await fetch("/task-manager/apis/sessions/current", {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error(response.statusText);
  }
  return;
}
