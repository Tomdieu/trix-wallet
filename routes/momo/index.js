const express = require('express')
const { route } = require('./account')

const router = express.Router()

router.use('/',require('./account'))


// module.exports = router

module.exports = {
    'account':require('./account')
}