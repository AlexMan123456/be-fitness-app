const data = require("../database/test-data/index.js")
const seed = require("../database/seed.js")
const { client, db } = require("../database/connection.js")
const app = require("../app.js")
const request = require("supertest")
const endpoints = require("../endpoints.json")
require("jest-sorted")


jest.setTimeout(16000);

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    client.close()
})

describe("/api", () => {
    describe("GET", () => {
        test("200: Responds with a JSON object detailing all endpoints", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then((response) => {
                expect(response.body.endpoints).toEqual(endpoints)
            })
        })
    })
})

describe("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with an array of all users", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                expect(response.body.users.length).toBe(3)
                response.body.users.forEach((user) => {
                    expect(user).toHaveProperty("_id")
                    expect(typeof user.name).toBe("string")
                    expect(typeof user.email).toBe("string")
                    expect(typeof user.age).toBe("number")
                    expect(typeof user.xp).toBe("number")
                    expect(typeof user.level).toBe("number")
                    expect(Array.isArray(user.goals)).toBe(true)
                    user.goals.forEach((goal) => {
                        expect(typeof goal).toBe("string")
                    })
                    expect(Array.isArray(user.reminders)).toBe(true)
                    user.reminders.forEach((reminder) => {
                        expect(typeof reminder.message).toBe("string")
                        expect(typeof reminder.reminder_time).toBe("string")
                    })
                    expect(typeof user.image_url).toBe("string")
                })
            })
        })
        describe("Queries", () => {
            test("200: Responds with an array of users sorted by XP in descending order when given a sort_by of xp", () => {
                return request(app)
                .get("/api/users?sort_by=xp")
                .expect(200)
                .then((response) => {
                    expect(response.body.users).toBeSortedBy("xp", {descending: true})
                })
            })
        })
    })
})

describe("/api/users/:user_id", () => {
    describe("GET", () => {
        test("200: Returns a user with the corresponding ID", () => {
            return request(app)
            .get("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user._id).toEqual("648d9f1a7a2d5b1f1e6d1235")
                expect(typeof user.name).toBe("string")
                expect(typeof user.email).toBe("string")
                expect(typeof user.age).toBe("number")
                expect(typeof user.xp).toBe("number")
                expect(typeof user.level).toBe("number")
                expect(Array.isArray(user.goals)).toBe(true)
                user.goals.forEach((goal) => {
                    expect(typeof goal).toBe("string")
                })
                expect(Array.isArray(user.reminders)).toBe(true)
                user.reminders.forEach((reminder) => {
                    expect(typeof reminder.message).toBe("string")
                    expect(typeof reminder.reminder_time).toBe("string")
                })
                expect(typeof user.image_url).toBe("string")
            })
        })
        test("400: Responds with a bad request message if ID is invalid", () => {
            return request(app)
            .get("/api/users/invalid_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid ID")
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/users/673b26e3656d6301098761d5")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
    describe("PATCH", () => {
        test("200: Adds a goal to the goals array when given a valid goal property", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .send({add_goal: "Goal 3"})
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user._id).toBe("648d9f1a7a2d5b1f1e6d1235")
                expect(user.goals).toEqual(expect.arrayContaining(["Goal 3"]))
            })
        })
        test("200: Increments the level and updates workout_log when given a valid level_increment property", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .send({level_increment: 1})
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user._id).toBe("648d9f1a7a2d5b1f1e6d1235")
                expect(user.level).toBe(4)
                expect(user.workout_log.length).toBe(3)
            })
        })
        test("200: Removes a goal from the goals array when given a goal to remove", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1234")
            .send({remove_goal: "Lose weight"})
            .then((response) => {
                const {user} = response.body
                expect(user._id).toBe("648d9f1a7a2d5b1f1e6d1234")
                expect(user.goals).not.toEqual(expect.arrayContaining(["Lose weight"]))
            })
        })
        test("200: Ignores any extra keys on object being sent", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .send({add_goal: "Goal 3", extraKey: "Extra value"})
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user._id).toBe("648d9f1a7a2d5b1f1e6d1235")
                expect(user.goals).toEqual(expect.arrayContaining(["Goal 3"]))
            })
        })
        test("200: Each property has no affect on other ones", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .send({remove_goal: "Improve stamina", add_goal: "New goal"})
            .expect(200)
            .then((response) => {
                const {user} = response.body
                expect(user._id).toBe("648d9f1a7a2d5b1f1e6d1235")
                expect(user.goals).toEqual(expect.arrayContaining(["New goal"]))
                expect(user.goals).not.toEqual(expect.arrayContaining(["Improve stamina"]))
                expect(!!user.goals).toBe(true)

            })
        })
        test("400: Responds with a bad request message when trying to add a goal that already exists", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1236")
            .send({add_goal: "Run a marathon"})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Goal already exists")
            })
        })
        test("404: Responds with a not found message when trying to remove a goal that does not exist", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1234")
            .send({remove_goal: "Nonexistent goal"})
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Goal not found")
            })
        })
        test("400: Responds with a bad request message when level_increment causes level to be less than 1", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1234")
            .send({level_increment: -1})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("User's level cannot be decremented any further")
            })
        })
        test("400: Responds with a bad request message when given an invalid ID", () => {
            return request(app)
            .patch("/api/users/invalid_id")
            .send({add_goal: "Goal 3"})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid ID")
            })
        })
        test("400: Responds with an error message when given an empty object", () => {
            return request(app)
            .patch("/api/users/648d9f1a7a2d5b1f1e6d1235")
            .send({})
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Bad request")
            })
        })
        test("404: Responds with a not found message when user does not exist", () => {
            return request(app)
            .patch("/api/users/673b26e3656d6301098761da")
            .send({add_goal: "Goal 3"})
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("User not found")
            })
        })
    })
})

describe("/api/users/:user_id/goals", () => {

})

describe("/api/exercises", () => {
    describe("GET", () => {
        test("200: Returns an array of all exercises", () => {
            return request(app)
            .get("/api/exercises")
            .expect(200)
            .then((response) => {
                expect(response.body.exercises.length).toBe(9)
                response.body.exercises.forEach((exercise) => {
                expect(exercise).toHaveProperty("_id");
                expect(typeof exercise.name).toBe("string")
                expect(typeof exercise.type).toBe("string")
                expect(typeof exercise.target_muscle_group).toBe("string")
                expect(typeof exercise.description).toBe("string")
                })
            })
        })
    })
})

describe("/api/exercises/:exercise_id", () => {
    describe("GET", () => {
        test("200: Returns an exercise with the corresponding ID", () => {
            return request(app)
            .get("/api/exercises/64ae9f1b7a2d5b1f1e6d3001")
            .expect(200)
            .then((response) => {
                const exercise = response.body.exercise;
                expect(exercise._id).toBe("64ae9f1b7a2d5b1f1e6d3001");
                expect(typeof exercise.name).toBe("string")
                expect(typeof exercise.type).toBe("string")
                expect(typeof exercise.target_muscle_group).toBe("string")
                expect(typeof exercise.duration_in_seconds).toBe("number")
                expect(typeof exercise.description).toBe("string")
            })
        })
        test("400: Responds with a bad request message if ID is invalid", () => {
            return request(app)
            .get("/api/exercises/invalid_exercise_id")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid ID")
            })
        })
        test("404: Responds with a not found message if user does not exist", () => {
            return request(app)
            .get("/api/exercises/673b26e3656d6301098761da")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Exercise not found")
            })
        })
    })
})

describe("/api/workouts/:level", () => {
    describe("GET", () => {
        test("200: Returns a workout given the workout level", () => {
            return request(app)
            .get("/api/workouts/1")
            .expect(200)
            .then((response) => {
                const { workout } = response.body;
                expect(workout.level).toBe(1);
                expect(typeof workout.level).toBe("number");
                expect(typeof workout.total_duration).toBe("number");
                expect(Array.isArray(workout.exercises)).toBe(true);
                workout.exercises.forEach((exercise) => {
                    expect(exercise).toHaveProperty("_id");
                    expect(typeof exercise.name).toBe("string");
                    expect(typeof exercise.type).toBe("string");
                    expect(typeof exercise.target_muscle_group).toBe("string");
                    expect(typeof exercise.description).toBe("string");
                })
            })
        })
        test("400: Responds with a bad request message if workout level is invalid", () => {
            return request(app)
            .get("/api/workouts/wrongLvl")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid level")
            })
        })
        test("404: Responds with a not found message if workout does not exist", () => {
            return request(app)
            .get("/api/workouts/44333")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("Workout not found")
            })
        })
    })
})

describe("/api/workouts", () => {
    describe("GET", () => {
        test("200: Returns all workouts", () => {
            return request(app)
            .get("/api/workouts")
            .expect(200)
            .then((response) => {
                const { workouts } = response.body;
                workouts.forEach((workout) => {
                    expect(typeof workout.level).toBe("number");
                });
            });
        });
        test('200: All workouts sorted by level by default', () => {
            return request(app)
            .get("/api/workouts")
            .expect(200)
              .then(({ body }) => {
                const workouts = body.workouts;
                for (let i = 1; i < workouts.length; i++) {
                    expect(workouts[i - 1].level).toBeLessThanOrEqual(workouts[i].level);
                }
            });
        });
        test("200: Should sort workouts by total_duration in descending order when given the corresponding queries", () => {
            return request(app)
              .get("/api/workouts?sort_by=total_duration&order=DESC")
              .expect(200)
              .then(({ body }) => {
                const workouts = body.workouts;
                for (let i = 1; i < workouts.length; i++) {
                    expect(workouts[i - 1].total_duration).toBeGreaterThanOrEqual(workouts[i].total_duration);
                }
            });        
        });
        test("200: Responds with all workouts sorted in specified order, where order query is case insensitive", () => {
            return Promise.all(
                [
                    request(app)
                    .get("/api/workouts?order=desc")
                    .expect(200)
                    .then((response) => {
                        const {workouts} = response.body
                        for (let i = 1; i < workouts.length; i++) {
                            expect(workouts[i - 1].level).toBeGreaterThanOrEqual(workouts[i].level);
                        }
                    }),
                    request(app)
                    .get("/api/workouts?sort_by=total_duration&order=aSc")    
                    .expect(200)
                    .then((response) => {
                        const {workouts} = response.body
                        for (let i = 1; i < workouts.length; i++) {
                            expect(workouts[i - 1].total_duration).toBeLessThanOrEqual(workouts[i].total_duration);
                        }
                    })
                ]
            )
        })
        test("400: Responds with a bad request message when sort_by query is not valid (i.e. not total_duration or level)", () => {
            return request(app)
            .get("/api/workouts?sort_by=invalid_sort_by")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid sort by")
            })
        })
        test("400: Responds with a bad request message when order query is not valid (i.e. not ASC or DESC)", () => {
            return request(app)
            .get("/api/workouts?order=invalid_order")
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe("Invalid order")
            })
        })
    });
});

describe("/*", () => {
    test("404: Responds with an error if given an invalid endpoint", () => {
        return request(app)
        .get("/api/invalid_endpoint")
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe("Endpoint not found")
        });
    });
});

