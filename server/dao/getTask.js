"use strict";

exports.getTask = (db, taskId, userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM tasks WHERE id=? AND userId=?";

    db.get(query, taskId, userdId, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};
