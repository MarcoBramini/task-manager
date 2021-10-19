"use strict";

const { query, validationResult } = require("express-validator"); // validation middleware
const dao = require("../dao/dao");
const { checkAllowedParamValues } = require("./customValidators");

const allowedFilterIds = [
  "all",
  "important",
  "private",
  "today",
  "next-seven-days",
];

exports.getFilteredTasksValidationChain = [
  query("filter").custom(checkAllowedParamValues(allowedFilterIds)),
  query("timezone").isString(),
];

exports.getFilteredTasksHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const result = await dao.getFilteredTasks(
      req.user.id, // we are sure that exists because we already checked for the user to be authenticated
      req.query.filter,
      req.query.timezone
    );
    if (result.error) res.status(404).json(result);

    return res.json(result);
  } catch (err) {
    console.log(
      "dao.getFilteredTasks(filter: " +
        req.query.filter +
        ") failed with: " +
        err.message
    );
    return res.status(500).json({ error: "Something wrong happened :(" });
  }
};
