"use strict";

const { param, validationResult } = require("express-validator"); // validation middleware
const dao = require("../dao/dao");

exports.deleteTaskValidationChain = [param("taskId").exists().isInt()];

exports.deleteTaskHandler = async (req, res) => {
  // Check if validation succeeds
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  // Delete task
  try {
    await dao.deleteTask(req.params.taskId, req.user.id);
    res.status(204).end();
  } catch (err) {
    console.error(
      "dao.deleteTask(taskId: " +
        req.params.taskId +
        ") failed with: " +
        err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
};
