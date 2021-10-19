"use strict";

exports.deleteTask = (db, taskId, userId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM tasks WHERE id = ? AND userId = ?";

    db.run(query, [taskId, userId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
