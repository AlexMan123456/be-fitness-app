const { fetchWorkoutByLevel, fetchAllWorkouts } = require("../models/workouts-model.js")


function getAllWorkouts(request, response, next) {
    fetchAllWorkouts(request.query).then((workouts) => {
        response.status(200).send({workouts});
    }).catch((err) => {
        next(err)
    })
}


function getWorkoutByLevel(request, response, next) {
    const { level } = request.params;
    fetchWorkoutByLevel(level).then((workout) => {
        response.status(200).send({workout})
    }).catch((err) => {
        next(err);
    })

}

module.exports = { getWorkoutByLevel, getAllWorkouts }