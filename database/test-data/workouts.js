const { ObjectId } = require("mongodb")

const workouts = [
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d401"),
    level: 1,
    exercise_names: ["Push-Ups", "Jumping Jacks", "Plank"],
  },
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d403"),
    level: 3,
    exercise_names: ["Burpees", "Lunges", "Push-Ups", "Jumping Jacks"],
  },
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d402"),
    level: 2,
    exercise_names: ["Squats", "Plank", "Mountain Climbers"],
  },
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d404"),
    level: 4,
    exercise_names: ["Bicep Curls", "Tricep Dips", "Mountain Climbers", "Squats"],
  },
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d406"),
    level: 6,
    exercise_names: ["Squats", "Bicep Curls", "Tricep Dips", "Mountain Climbers", "Burpees"],
  },
  {
    _id: new ObjectId("64c0f3a6e8a2d5b1f1e6d405"),
    level: 5,
    exercise_names: ["Lunges", "Burpees", "Plank", "Push-Ups", "Jumping Jacks"],
  },
];

module.exports = workouts
