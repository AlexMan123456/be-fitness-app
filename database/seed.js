const getTotalDurationOfWorkout = require("../utils/get-total-duration-of-workout.js")
const {db, client} = require("./connection.js")
const {ObjectId} = require("mongodb")

function seed({users, exercises, workouts}){
    return db.collection("workouts").drop().then(() => {
        return db.collection("users").drop()
    }).then(() => {
        return db.collection("exercises").drop()
    }).then(() => {
        return db.createCollection("users")
    }).then(() => {
        return db.collection("users").insertMany(users)
    }).then(() => {
        return db.collection("users").find({}).toArray()
    }).then((users) => {
        const promises = users.map((user) => {
            db.collection("users").findOneAndUpdate({_id: user._id}, {$set: {image_url: "https://hips.hearstapps.com/hmg-prod/images/hlh070123feacover-004-hi-646d26d7015ef.jpg"}})
        })
        return Promise.all(promises)
    }).then(() => {
        return db.createCollection("exercises")
    }).then(() => {
        return db.collection("exercises").insertMany(exercises)
    })
    .then(() => {
        return db.createCollection("workouts")
    }).then(() => {
        return db.collection("workouts").insertMany(workouts)
    }).then(() => {
        return db.collection("workouts").find({}).toArray()
    }).then((workouts) => {
        const promises = workouts.map((workout) => {
            return Promise.all(
                workout.exercise_names.map((exerciseName) => {
                    return db.collection("exercises").findOne({name: exerciseName})
                })
            )
        })
        return Promise.all([Promise.all(promises), workouts])
    }).then(([exercisesForWorkouts, workouts]) => {
        const promises = workouts.map((workout, index) => {
            return db.collection("workouts").findOneAndUpdate({_id: workout._id}, {
                $set: {
                    exercises: exercisesForWorkouts[index],
                    total_duration: getTotalDurationOfWorkout(exercisesForWorkouts[index])
                },
                $unset: {
                    exercise_names: ""
                }
            })
        })
        return Promise.all(promises)
    }).then(() => {
        return db.collection("users").find({}).toArray()
    }).then((users) => {
        const promises = users.map((user) => {
            user.reminders.forEach((reminder) => {
                reminder.message = `Complete level ${user.level} today!`
            })
            return db.collection("users").findOneAndUpdate({_id: user._id}, {
                $set: {
                    reminders: user.reminders
                }
            })
        })
        return Promise.all(promises)
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = seed