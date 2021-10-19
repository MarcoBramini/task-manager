"use strict";

const morgan = require("morgan");

const express = require("express");
const session = require("express-session"); // enable sessions

const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // username and password for login

const {
  updateTaskHandler,
  updateTaskValidationChain,
} = require("./handlers/updateTaskHandler");
const {
  createTaskHandler,
  createTaskValidationChain,
} = require("./handlers/createTaskHandler");
const {
  getFilteredTasksHandler,
  getFilteredTasksValidationChain,
} = require("./handlers/getFilteredTasksHandler");
const {
  getTaskHandler,
  getTaskValidationChain,
} = require("./handlers/getTaskHandler");
const {
  deleteTaskHandler,
  deleteTaskValidationChain,
} = require("./handlers/deleteTaskHandler");
const {
  loginUserStrategy,
  buildSessionUserData,
  getUserDataFromSession,
  loginUserHandler,
  loginUserValidationChain,
  getCurrentUserHandler,
  logoutUserHandler,
} = require("./handlers/authHandlers");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(loginUserStrategy));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser(buildSessionUserData);

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser(getUserDataFromSession);

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

const serverPort = 3001;
const basePath = "/task-manager/apis";

// Initialize server
const app = new express();

app.use(morgan("dev"));

app.use(express.json());
app.use(
  session({
    secret: "very-secret-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(serverPort, () =>
  console.log(`Server running on http://localhost:${serverPort}/`)
);

/*** Auth APIs ***/

/* LoginUser */
app.post(
  basePath + "/sessions",
  loginUserValidationChain,
  loginUserHandler(passport)
);

/* GetCurrentUser */
app.get(basePath + "/sessions/current", getCurrentUserHandler);

/* LogoutUser */
app.delete(basePath + "/sessions/current", logoutUserHandler);

/*** TaskManager APIs ***/

/* CreateTask */
app.post(
  basePath + "/tasks",
  isLoggedIn,
  createTaskValidationChain,
  createTaskHandler
);

/* GetFilteredTasks */
app.get(
  basePath + "/tasks",
  isLoggedIn,
  getFilteredTasksValidationChain,
  getFilteredTasksHandler
);

/* GetTask */
app.get(
  basePath + "/tasks/:taskId",
  isLoggedIn,
  getTaskValidationChain,
  getTaskHandler
);

/* UpdateTask */
app.put(
  basePath + "/tasks/:taskId",
  isLoggedIn,
  updateTaskValidationChain,
  updateTaskHandler
);

/* DeleteTask */
app.delete(
  basePath + "/tasks/:taskId",
  isLoggedIn,
  deleteTaskValidationChain,
  deleteTaskHandler
);
