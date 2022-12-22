const express = require("express");
const { User, Token } = require("../../models");

const userSchema = require("../../models/schema/userSchema");
const loginSchema = require("../../models/schema/loginSchema");
const updateUserSchema = require("../../models/schema/updateUserSchema");

const { TokenMiddleWare } = require("../../middlewares");

const { validate } = require("../../models/validation");

const router = express.Router();

const validator = require("../../utils/validator");

const {
  userControllers: {
    getAllUsers,
    loginUser,
    createUser,
    getUser,
    updateUser,
    deleteUser,
  },
} = require("../../controllers");

/**
 * Login
 * @typedef {object} Login
 * @property {string} username.required - The username
 * @property {string} password.required - The user password
 */

/**
 * POST /api/user/login
 * @summary This is the login route
 * @tags User
 * @param {Login} request.body.required
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example request - example payload
 * {
 *  "username":"username",
 *  "password":"password"
 * }
 * @example response - 200 - exmaple success
 * {
 * "success": true,
    "message": "login successfull",
    "data": {
      "user": {
        "id": 1,
        "username": "your_username",
        "first_name": "your_firstname",
        "last_name": "your_lastname",
        "email":"your_email",
        "phone_number": "your_phone_number",
        "is_superuser": false,
        "lang": "EN",
        "password": "your_hashed_password",
        "created_at": "2022-12-20T08:58:49.485Z",
        "updated_at": "2022-12-20T08:58:49.485Z"
      },
      "token": "your_token"
}
 * }
 * 
 * @example response - 400 - example error response
 * {
 *  "success": false,
 *  "message": "username or password incorrect"
 * }
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * Register
 * @typedef {object} User
 * @property {number} id
 * @property {string} username.required - The user's username
 * @property {string} first_name.required - The user's first name
 * @property {string} last_name - The user's last name
 * @property {string} email.required - The user's email
 * @property {boolean} is_superuser - Whether the user is a superuser
 * @property {string} lang - The user's language
 * @property {string} phone_number.required - The user's phone number
 * @property {string} password.required -The user's password
 */

/**
 * POST /api/user/register
 * @summary This router is use to register a user
 * @tags User
 * @param {User} request.body.required
 * @return {object} 200 - success response application/json
 */
router.post("/register", validate(userSchema), createUser);

/**
 * GET /api/user/
 * @tags User
 * @summary Returns a list of users
 * @security BearerAuth
 * @return {array<User>} 200 - success response application/json
 * @return {object} 400 - Bad request response
 */
router.get("/", TokenMiddleWare, getAllUsers);


/**
 * GET /api/user/{id}
 * @tags User
 * @param {int} id.param
 * @summary Get a user
 * @security BearerAuth
 * @return {User} 200 - success response application/json
 */
router.get("/:id", TokenMiddleWare, getUser);

/**
 * PUT /api/user/{id}
 * @tags User
 * @security BearerAuth
 * @param {int} id.param
 * @param {User} request.body
 * @returns {object} 200
 */
router.patch("/:id", TokenMiddleWare, validate(updateUserSchema), updateUser);

/**
 * PATCH /api/user/{id}
 * @tags User
 * @param {int} id.param
 * @security BearerAuth
 * @summary Update partialy a user
 * @param {User} request.body
 * @returns {object} 200
 */
router.put("/:id", TokenMiddleWare, validate(updateUserSchema), updateUser);

/**
 * DELETE /api/user/{id}
 * @tags User
 * @security BearerAuth
 * @summary This route is use to delete a user
 * @param {int} id.param
 * @returns {object} 200
 */
router.delete("/:id", TokenMiddleWare, deleteUser);

module.exports = router;
