"use strict";

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

function buildGetFilteredTasksQuery(userId, filterId, timezone) {
  let query = " SELECT * FROM tasks WHERE userId = ?";
  let params = [userId];

  switch (filterId) {
    case "important":
      query = query + " AND isImportant=1;";
      break;
    case "private":
      query = query + " AND isPrivate=1;";
      break;
    case "today":
      query = query + " AND deadline >= ? AND deadline <= ?;";
      let todayFrom = dayjs().startOf("day").tz(timezone).toISOString();
      let todayTo = dayjs().endOf("day").tz(timezone).toISOString();
      params.push(todayFrom, todayTo);
      break;
    case "next-seven-days":
      query = query + " AND deadline >= ? AND deadline <= ?;";
      let nextSevenDaysFrom = dayjs().startOf("day").tz(timezone).toISOString();
      let nextSevenDaysTo = dayjs()
        .endOf("day")
        .add(7, "day")
        .tz(timezone)
        .toISOString();
      params.push(nextSevenDaysFrom, nextSevenDaysTo);
      break;
    case "all":
    default:
  }

  return [query, params];
}

exports.getFilteredTasks = (db, userId, filterId, timezone) => {
  return new Promise((resolve, reject) => {
    const [query, params] = buildGetFilteredTasksQuery(
      userId,
      filterId,
      timezone
    );

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};
