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
    }).then(() => {
        return db.createCollection("workouts")
    }).then(() => {
        return db.collection("workouts").insertMany(workouts)
    }).then(() => {
        return db.collection("workouts").find({}).toArray()
    }).then((workouts) => {
        const promises = workouts.map((workout) => {
            return getTotalDurationOfWorkout(workout.exercise_ids)
        })

        return Promise.all([Promise.all(promises), workouts])
    }).then(([durations, workouts]) => {
        const promises = workouts.map((workout, index) => {
            return db.collection("workouts").findOneAndUpdate({_id: workout._id}, {$set: {total_duration: durations[index]}}, {returnDocument: "after"})
        })
        return Promise.all(promises)
    }).then((documents) => {
        
    })
    .catch((err) => {
        return err
    })
}

function getTotalDurationOfWorkout(exerciseIds){
    return Promise.all(
        exerciseIds.map((exerciseId) => {
            return db.collection("exercises").findOne({_id: exerciseId})
        })
    ).then((exercises) => {
        let total = 0
        exercises.forEach((exercise) => {
            total = total + exercise.duration_in_seconds
        })
        return total
    })
}

module.exports = seed