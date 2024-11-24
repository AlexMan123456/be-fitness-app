const express = require("express")
const app = express()
const users = require("./routers/users-router.js")
const exercises = require("./routers/exercises-router.js")
const workouts = require("./routers/workouts-router.js")
const cors = require("cors")
const { invalidEndpoint, mongoErrors, internalServerError, customErrors } = require("./error-handlers.js")
const endpoints = require("./routers/endpoints-router.js")

app.use(cors())
app.use(express.json())

app.use("/api", endpoints)

app.use("/api/users", users)
app.use("/api/exercises", exercises)
app.use("/api/workouts", workouts)



// Error handling
app.use(invalidEndpoint)

app.use(mongoErrors)
app.use(customErrors)

app.use(internalServerError)


module.exports = app