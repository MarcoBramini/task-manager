"use strict";

exports.createTask = (db, newTask) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO tasks(description, isImportant, isPrivate, deadline, isCompleted, userId) VALUES(?,?,?,?,?,?);";

    db.run(
      query,
      newTask.description,
      newTask.isImportant,
      newTask.isPrivate,
      newTask.deadline,
      newTask.isCompleted,
      newTask.userId,
      function (err) {
        if (err) {
          reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};
