"use strict";

const { createTask } = require("./createTask");
const { deleteTask } = require("./deleteTask");
const { getFilteredTasks } = require("./getFilteredTasks");
const { getTask } = require("./getTask");
const { updateTask } = require("./updateTask");
const { getUserByEmail, getUserById } = require("./getUser");
const sqlite = require("sqlite3");

// Initialize database
const db = new sqlite.Database("tasks.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  db.run("PRAGMA foreign_keys = ON"); // Enable foreign keys
});

// DAO methods
exports.createTask = (newTask) => createTask(db, newTask);

exports.getFilteredTasks = (userId, filter, timezone) =>
  getFilteredTasks(db, userId, filter, timezone);

exports.getTask = (taskId, userId) => getTask(db, taskId, userId);

exports.updateTask = (taskId, userId, params) =>
  updateTask(db, taskId, userId, params);

exports.deleteTask = (taskId, userId) => deleteTask(db, taskId, userId);

exports.getUserByEmail = (email) => getUserByEmail(db, email);

exports.getUserById = (userId) => getUserById(db, userId);
