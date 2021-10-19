"use strict";

const { param, validationResult } = require("express-validator"); // validation middleware
const dao = require("../dao/dao");

exports.getTaskValidationChain = [param("taskId").exists().isInt()];

exports.getTaskHandler = async (req, res) => {
  // Check if validation succeeds
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  // Get task
  try {
    const result = await dao.getTask(
      req.params.taskId,
      req.user.id // we are sure that exists because we already checked for the user to be authenticated
    );
    res
      .status(200)
      .json({ ...result, description: unescape(result.description) });
  } catch (err) {
    console.error(
      "dao.getTask(taskId: " +
        req.params.taskId +
        ") failed with: " +
        err.message
    );
    res.status(500).json({ error: "Something wrong happened :(" });
  }
};
