const users = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 29,
    xp: 120,
    level: 1,
    goals: ["Lose weight", "Build core strength"],
    reminders: [{ reminder_time: new Date("2024-11-21T08:00:00") }],
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    age: 34,
    xp: 220,
    level: 3,
    goals: ["Gain muscle", "Improve stamina"],
    reminders: [{ reminder_time: new Date("2024-11-21T07:30:00") }],
    workout_log: [
      {level: 1, date_completed: new Date("2024-11-19T07:30:00")},
      {level: 2, date_completed: new Date("2024-11-20T07:30:00")}
    ]
  },
  {
    name: "Charlie Lee",
    email: "charlie.lee@example.com",
    age: 25,
    xp: 300,
    level: 4,
    goals: ["Build strength", "Run a marathon"],
    reminders: [{ reminder_time: new Date("2024-11-21T06:30:00") }],
    workout_log: [
      {level: 1, date_completed: new Date("2024-11-18T06:30:00")},
      {level: 2, date_completed: new Date("2024-11-19T06:30:00")},
      {level: 3, date_completed: new Date("2024-11-20T06:30:00")}
    ]
  },
]

module.exports = users
