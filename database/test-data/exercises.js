const { ObjectId } = require("mongodb")

const exercises = [
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3001"),
    name: "Push-Ups",
    type: "Strength",
    target_muscle_group: "Chest",
    duration_in_seconds: 30,
    description: "A bodyweight exercise to strengthen the chest, shoulders, and triceps.",
    xp: 50,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3002"),
    name: "Squats",
    type: "Strength",
    target_muscle_group: "Legs",
    duration_in_seconds: 40,
    description: "A lower body exercise that targets quads, hamstrings, and glutes.",
    xp: 60,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3003"),
    name: "Plank",
    type: "Core",
    target_muscle_group: "Abs",
    duration_in_seconds: 60,
    description: "Hold your body in a straight line while supporting your weight on your forearms and toes.",
    xp: 70,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3004"),
    name: "Jumping Jacks",
    type: "Cardio",
    target_muscle_group: "Full Body",
    duration_in_seconds: 45,
    description: "A cardio exercise to improve endurance and warm up the body.",
    xp: 40,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3005"),
    name: "Bicep Curls",
    type: "Strength",
    target_muscle_group: "Arms",
    duration_in_seconds: 50,
    description: "An arm-focused exercise using dumbbells to target the biceps.",
    xp: 65,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3006"),
    name: "Burpees",
    type: "Cardio",
    target_muscle_group: "Full Body",
    duration_in_seconds: 60,
    description: "A high-intensity full-body exercise for endurance and strength.",
    xp: 80,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3007"),
    name: "Lunges",
    type: "Strength",
    target_muscle_group: "Legs",
    duration_in_seconds: 50,
    description: "A single-leg exercise to strengthen quads, hamstrings, and glutes.",
    xp: 70,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3008"),
    name: "Mountain Climbers",
    type: "Cardio",
    target_muscle_group: "Core",
    duration_in_seconds: 40,
    description: "A cardio exercise that engages your core and improves agility.",
    xp: 60,
  },
  {
    _id: new ObjectId("64ae9f1b7a2d5b1f1e6d3009"),
    name: "Tricep Dips",
    type: "Strength",
    target_muscle_group: "Arms",
    duration_in_seconds: 30,
    description: "An upper-body exercise focusing on the triceps using a bench or similar support.",
    xp: 55,
  },
];

module.exports = exercises;
