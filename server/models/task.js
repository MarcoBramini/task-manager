function Task(
  id,
  description,
  userId,
  deadline = null,
  isImportant = true,
  isPrivate = false,
  isCompleted = false
) {
  this.id = id;
  this.description = description;
  this.userId = userId;
  this.deadline = deadline;
  this.isPrivate = isPrivate;
  this.isImportant = isImportant;
  this.isCompleted = isCompleted;
}

module.exports = Task;
