const { ObjectId } = require("mongodb");
const { client, db } = require("../database/connection.js");
const workoutsDb = db.collection("workouts");

function fetchAllWorkouts(queries){
    const validCols = ["total_duration", "level"]
    const validOrder = ["ASC", "DESC"]

    const sortBy = queries.sort_by ? queries.sort_by : "level"
    const order = queries.order ? queries.order.toUpperCase() : "ASC"

    if (!validCols.includes(sortBy)) {
        return Promise.reject({status: 400, message: "Invalid sort by"})
    }
    if (!validOrder.includes(order)) {
        return Promise.reject({status: 400, message: "Invalid order"})
    }

    return client.connect().then(() => {
        return workoutsDb.aggregate([
            { $sort: { [sortBy]: order === "DESC" ? -1 : 1 }}
        ]).toArray()
        //return workoutsDb.find({}).sort({[queries.sort_by]: normalizedOrder === "DESC" ? -1 : 1}).toArray()
    }).then((workouts) => {
        return workouts;
    })
}


function fetchWorkoutByLevel(workoutLevel) {
    if (isNaN(workoutLevel)) {
        return Promise.reject({status: 400, message: "Invalid level"})
    }
    return client.connect().then(() => {
        return workoutsDb.findOne({level: parseInt(workoutLevel)});
    }).then((workout) => {
        if(!workout) {
            return Promise.reject({status: 404, message: "Workout not found"});
        }
        return workout;
    })

}


module.exports = { fetchWorkoutByLevel, fetchAllWorkouts }