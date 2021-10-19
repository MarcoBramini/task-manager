"use strict";

const { param, body, validationResult, oneOf } = require("express-validator"); // validation middleware
const { checkAllowedBodyFields } = require("./customValidators");
const dao = require("../dao/dao");

const allowedBodyFields = [
  "description",
  "deadline",
  "isImportant",
  "isPrivate",
  "isCompleted",
];

exports.updateTaskValidationChain = [
  body().custom(checkAllowedBodyFields(allowedBodyFields)),
  param("taskId").exists().isInt(),
  body("description").optional({ nullable: true }).escape(),
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

exports.updateTaskHandler = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  // Update task
  try {
    let updatedTaskId = await dao.updateTask(
      req.params.taskId,
      req.user.id, // we are sure that exists because we already checked for the user to be authenticated
      req.body
    );
    res.status(200).json({ taskId: updatedTaskId });
  } catch (err) {
    // log error
    console.log(
      "dao.updateTask(taskId:",
      req.params.taskId,
      ", body:",
      req.body,
      ") failed with error: " + err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
};
