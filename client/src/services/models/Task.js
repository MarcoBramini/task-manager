import dayjs from "dayjs";

const TaskState = {
  OK: 0,
  CHANGED: 1,
  DELETED: 2,
};

function Task(
  id,
  description,
  deadline = null,
  isImportant = true,
  isPrivate = false,
  state = TaskState.OK,
  isCompleted = false,
  userId = null
) {
  this.id = id;
  this.description = description;
  this.userId = userId;
  if (deadline !== null) this.deadline = dayjs(deadline);
  this.isPrivate = isPrivate;
  this.isImportant = isImportant;
  this.state = state;
  this.isCompleted = isCompleted;
}

export { Task as default, TaskState };
