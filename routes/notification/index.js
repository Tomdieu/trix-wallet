const express = require('express')


const router = express.Router()

const { TokenMiddleWare } = require("../../middlewares");

const {notificationControllers:{getNotifications}} = require("../../controllers/")


/**
 * Notification
 * @typedef {object} Notification
 * @property {number} id
 * @property {number} user_id - The user id
 * @property {string} message - The notification content
 * @property {enum} type - The type of notifications
 */


/**
 * GET /api/notification
 * @tags Notification
 * @security BearerAuth
 * @summary Gets all the notification of a user
 * @returns {array<Notification>} 200
 */
router.get('/',TokenMiddleWare,getNotifications)

module.exports = router