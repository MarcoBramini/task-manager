"use strict";

exports.getUserByEmail = (db, email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, email, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

exports.getUserById = (db, userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE id = ?";

    db.get(query, userId, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};
