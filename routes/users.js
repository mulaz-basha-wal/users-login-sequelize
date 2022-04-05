var express = require("express");
var router = express.Router();
const usersModel = require("../models").User;

router.get("/", function (req, res, next) {
  usersModel.findAll().then(
    function (users) {
      res.status(200).json(users);
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  usersModel.findAll().then(
    function (users) {
      let flag = false;
      users.forEach((user) => {
        if (user.username === username) {
          flag = true;
        }
      });
      if (flag) {
        res.status(409).json({ status: 0, debug_date: "user already existed" });
      } else {
        usersModel
          .create({
            username,
            password,
            date_of_creation: new Date().toISOString(),
          })
          .then(
            (user) => {
              res.status(200).json({ status: 1, user });
            },
            (error) => {
              res.status(500).json(error);
            }
          );
      }
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.put("/:username", (req, res) => {
  usersModel
    .update(req.body, {
      where: {
        username: req.params.username,
      },
    })
    .then((status) => {
      if (status === 1) {
        res.status(200).json({ status: 1, debug_date: "updated successfully" });
      } else {
        res.status(404).json({ status: 0, debug_date: "record not found" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/:username", (req, res) => {
  usersModel
    .destroy({
      where: {
        username: req.params.username,
      },
    })
    .then((status) => {
      if (status === 1) {
        res.status(200).json({ status: 1, debug_date: "deleted successfully" });
      } else {
        res.status(404).json({ status: 0, debug_date: "record not found" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/checklogin", (req, res) => {
  const { username, password } = req.body;
  usersModel.findAll().then(
    function (users) {
      let flag = false;
      users.forEach((user) => {
        if (user.username === username && user.password === password) {
          flag = true;
        }
      });
      if (flag) {
        req.session["isLoggedIn"] = 1;
        req.session["username"] = username;
        res.status(200).json({ status: 1, data: username });
      } else {
        req.session["isLoggedIn"] = 0;
        res.status(401).json({ status: 0, data: "incorrect login details" });
      }
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.get("/loggeduser", (req, res) => {
  if (req.session.isLoggedIn === 1) {
    usersModel.findOne().then(
      function (user) {
        res.status(200).json({ status: 1, data: user });
      },
      function (error) {
        res.status(500).json(error);
      }
    );
  } else {
    res.json({ status: 0, debug_data: "you are not logged in " });
  }
});

module.exports = router;
