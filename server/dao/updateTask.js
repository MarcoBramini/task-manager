"use strict";

function buildUpdateTaskSQLQuery(taskId, userId, params) {
  let query = `
  UPDATE tasks
  SET `;
  let queryParams = [];

  // Build query's SET section
  for (let [key, value] of Object.entries(params)) {
    query = query + key + "=?, ";
    queryParams.push(value);
  }

  // Build query's WHERE section
  query = query.substr(0, query.length - 2) + "\nWHERE id = ? AND userId = ?;";
  queryParams.push(taskId);
  queryParams.push(userId);

  return [query, queryParams];
}

// params must contain one or more Task's field
exports.updateTask = (db, taskId, userId, params) => {
  return new Promise((resolve, reject) => {
    const [query, queryParams] = buildUpdateTaskSQLQuery(
      taskId,
      userId,
      params
    );

    db.run(query, queryParams, (err) => {
      if (err) {
        reject(err);
      }
      resolve(taskId);
    });
  });
};
