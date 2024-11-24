const express = require("express");
const { getWorkoutByLevel, getAllWorkouts } = require("../controllers/workouts-controller");

const router = express.Router();

router.route("/")
.get(getAllWorkouts)

router.route("/:level")
.get(getWorkoutByLevel)

module.exports = router;