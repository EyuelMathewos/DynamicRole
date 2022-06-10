import express from "express";

var router = express.Router();
router.route("/")
  .get((req, res) => {
    res.send('Express is running!')
  })
module.exports = router;