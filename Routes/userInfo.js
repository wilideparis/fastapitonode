const {createUser,getUser,login}=require("../controll/userInfoController");
const express =require("express");
const Uroutes= express.Router();
const protect=require("../middleWares/authMiddleWare")

/**
 * This provites the a routes to create a user /user/create
 * @route {function} createUser - The first number.
 * @param {string} "user/create" - The second number.
 * @returns {object} this is a route to create a new user and returns the created user.
 * hello
 */

Uroutes.post('/create',createUser)
/**
 * This is the getuser route /user/get/:id provides aroute to get a user
 * this get a specifi user and the routes is .
 * @route {function} getUser - The first number.
 * @param {string} "api/get/:id" - The second number.
 * @returns {object} this is a route to displays info of a specific user
 * 
 */

Uroutes.get("/get/:id",getUser)
/**
 * log in route user/login 
 * this provites a route for a user to login
 * @route {function} login - this is the login function imported from its controller.
 * @param {string} "user/login" - The second number.
 * @returns {object} this is a route logs in a user and returns the users info
 * 
 */

Uroutes.post("/login",login);


module.exports=Uroutes;        