"use strict";

const { body } = require("express-validator");
const { checkAllowedBodyFields } = require("./customValidators");
const dao = require("../dao/dao");
const bcrypt = require("bcrypt");

const allowedBodyFields = ["username", "password"];

exports.loginUserValidationChain = [
  body().custom(checkAllowedBodyFields(allowedBodyFields)),
  body("username").exists().isEmail(),
  body("password").exists().escape().isString(),
];

exports.loginUserStrategy = (username, password, done) => {
  dao
    .getUserByEmail(username)
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });
      }

      bcrypt
        .compare(password, user.hash)
        .then((result) => {
          if (!result) {
            return done(null, false, {
              message: "Incorrect username and/or password.",
            });
          }
          return done(null, user);
        })
        .catch((err) =>
          console.log(
            "loginUserStragegy() -> bcrypt.compare(...) failed with: ",
            err
          )
        );
    })
    .catch((err) =>
      console.log(
        "loginUserStragegy()-> dao.getUserByEmail(...) failed with: ",
        err
      )
    );
};

exports.buildSessionUserData = (user, done) => {
  done(null, user.id);
};

exports.getUserDataFromSession = (id, done) => {
  dao
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
};

exports.loginUserHandler = (passport) => {
  return async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err) return next(err);

        return res.json({ ...req.user, hash: undefined });
      });
    })(req, res, next);
  };
};

exports.getCurrentUserHandler = async (req, res) => {
  if (req.isAuthenticated())
    return res.json({ currentUser: { ...req.user, hash: undefined } });
  return res.json({ currentUser: null });
};

exports.logoutUserHandler = async (req, res) => {
  req.logout();
  res.status(204).end();
};
