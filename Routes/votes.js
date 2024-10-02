const express=require("express");
 const voteRouter=express.Router()


const votes=require("../controll/votesController");
/**
 *  usersVotesroute /users/votes
 *  Posts - It provides route for users votes
 * @returns {Object} 201 - Created post
 * @returns {Error} default - Unexpected error
 */
 voteRouter.post("/users/votes",votes);
 



module.exports=voteRouter   