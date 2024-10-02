const { getpost, getOnePost, deletePost, UpdatePost, createPost } = require("../controll/userPostController");
const express = require("express");
const route = express.Router();
const protect=require("../middleWares/authMiddleWare")
// we will remove the protect midle ware since we want every body to be able to retrive a post


/**
 * @route GET /api/get
 * @group Posts - Operations about user posts
 * This routes helps to  grant access to all post on a page
 * @returns {Array.<Object>} 200 - An array of user posts
 * @returns {Error} default - Unexpected error
 */
route.get("/api/get",protect, getpost);
         
/**
 * POST /api/post/{id}
 *  This route provide access to the getOnePost function which helps to get a single Post
 * @param {string} id.path.required - post id
 * @returns {Error} default - Unexpected error
 */
route.get("/api/get/:id",protect, getOnePost);

/**
 *  DELETE /api/post/{id}
 *  This route helps to grant access to the delepost function which deletes a users Post
 * @param {string} id.path.required - post id
 * @returns {Error} default - Unexpected error
 */
route.delete("/api/delete/:id",protect,  deletePost);
   
/**   
 * UdatePost /api/get/{id}
*This routes provides access to update a users post
* @param {string} id.path.required - post id
 * @returns {Object} 200 - Updated post
 * @returns {Error} default - Unexpected error
 */
route.put("/api/put/:id",protect,  UpdatePost);
 
/**
 *  createPost /api/post
 * This route provides access the create route function
 *  Posts - Operations about user posts
 * @returns {Object} 201 - Created post
 * @returns {Error} default - Unexpected error
 */
route.post("/api/create",protect,createPost);

module.exports = route;