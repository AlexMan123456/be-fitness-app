const {client, db} = require("../database/connection.js")
const { ObjectId } = require("mongodb")
const usersDb = db.collection("users")

function fetchAllUsers(queries){
    /*const validQueries = ["sort_by", "order"]
    if(!Object.keys(queries).includes(validQueries)){
        return Promise.reject({status: 400, message: "One or more queries are invalid"})
    }*/
    const querySettings = {}
    return client.connect().then(() => {
        return usersDb.find({}).sort({xp: -1}).toArray()
    }).then((users) => {
        return users
    })
    
}

function fetchUserById(userId, queries){
    return client.connect().then(() => {
        return usersDb.findOne({_id: new ObjectId(userId)})
    }).then((user) => {
        if(!user){
            return Promise.reject({status: 404, message: "User not found"})
        }
        return user
    })
}


function updateUser(userId, propertiesToUpdate){
    const validKeys = ["add_goal", "level_increment", "remove_goal"]
    for(const key of Object.keys(propertiesToUpdate)){
        if(!validKeys.includes(key)){
            delete propertiesToUpdate.key
        }
    }

    if(Object.values(propertiesToUpdate).length === 0){
        return Promise.reject({status: 400, message: "Bad request"})
    }

    return client.connect().then(() => {
        return usersDb.findOne({_id: new ObjectId(userId)})
    }).then((user) => {
        if(!user){
            return Promise.reject({status: 404, message: "User not found"})
        }

        const newProperties = {}

        if(propertiesToUpdate.add_goal){
            if(user.goals.includes(propertiesToUpdate.add_goal)){
                return Promise.reject({status: 400, message: "Goal already exists"})
            }
            user.goals.push(propertiesToUpdate.add_goal)
            newProperties.goals = user.goals
        }

        if(propertiesToUpdate.remove_goal){
            if(!user.goals.includes(propertiesToUpdate.remove_goal)){
                return Promise.reject({status: 404, message: "Goal not found"})
            }
            user.goals.splice(user.goals.indexOf(propertiesToUpdate.remove_goal), 1)
            newProperties.goals = user.goals
        }

        const newLevel = user.level + propertiesToUpdate.level_increment
        if(propertiesToUpdate.level_increment){
            if(newLevel < 1){
                return Promise.reject({status: 400, message: "User's level cannot be decremented any further"})
            }
            if(!user.workout_log){
                user.workout_log = [{level: user.level, date_completed: new Date()}]
            } else {
                user.workout_log.push({level: user.level, date_completed: new Date()})
            }
            newProperties.level = newLevel
            newProperties.workout_log = user.workout_log
        }

        return usersDb.findOneAndUpdate(
            {_id: new ObjectId(userId)}, 
            {$set: newProperties}, 
            {returnDocument: "after"})
    }).then((user) => {
        return user
    })
}

module.exports = { fetchAllUsers, fetchUserById, updateUser }