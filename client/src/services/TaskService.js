import { TaskState } from "../services/models/Task";

// Filter operations

const filters = {
  all: "All",
  important: "Important",
  today: "Today",
  "next-seven-days": "Next 7 Days",
  private: "Private",
};

export const defaultFilter = Object.keys(filters)[0];

export function getFilterIds() {
  return Object.keys(filters);
}

export function getFilterLabel(filterId) {
  return filters[filterId];
}

// Local Tasks operations

export function addLocalTask(tasks, newTask) {
  return [...tasks, newTask];
}

export function getLocalTask(tasks, taskId) {
  return tasks.filter((t) => t.id === taskId)[0];
}

export function searchLocalTasks(tasks, searchValue) {
  if (!searchValue) return tasks;
  return tasks.filter((t) =>
    t.description.toLowerCase().includes(searchValue.toLowerCase())
  );
}

export function updateLocalTask(tasks, updatedTask) {
  let newTasks = [...tasks];
  newTasks[newTasks.findIndex((t) => t.id === updatedTask.id)] = updatedTask;
  return newTasks;
}

export function completeLocalTask(tasks, taskId, isCompleted) {
  let newTasks = [...tasks];
  let completedTask = newTasks[newTasks.findIndex((t) => t.id === taskId)];
  completedTask.isCompleted = isCompleted;
  completedTask.state = TaskState.CHANGED;
  return newTasks;
}

export function deleteLocalTask(tasks, taskId) {
  let newTasks = [...tasks];
  newTasks.find((t) => t.id === taskId).state = TaskState.DELETED;
  return newTasks;
}
