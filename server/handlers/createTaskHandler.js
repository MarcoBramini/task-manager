"use strict";

const { body, validationResult, oneOf } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");
const Task = require("./../models/task");
const dao = require("../dao/dao");

const allowedBodyFields = [
  "description",
  "deadline",
  "isImportant",
  "isPrivate",
  "isCompleted",
];

exports.createTaskValidationChain = [
  body().custom(checkAllowedBodyFields(allowedBodyFields)),
  body("description").exists().escape(),
  body("deadline")
    .optional({ nullable: true })
    .isISO8601({ strict: true, strictSeparator: true }),
  oneOf([
    body(["isImportant", "isPrivate", "isCompleted"])
      .optional({ nullable: true })
      .isBoolean(),
    body(["isImportant", "isPrivate", "isCompleted"])
      .optional({ nullable: true })
      .isInt(),
  ]),
];

exports.createTaskHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const newTask = new Task(
    null,
    req.body.description,
    req.user.id, // we are sure that exists because we already checked for the user to be authenticated
    req.body.deadline,
    req.body.isImportant,
    req.body.isPrivate,
    req.body.isCompleted
  );

  try {
    const newTaskId = await dao.createTask(newTask);
    res.status(200).json({ newTaskId: newTaskId });
  } catch (err) {
    console.error(
      "dao.createTask(newTask:",
      newTask,
      ") failed with: " + err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
};
