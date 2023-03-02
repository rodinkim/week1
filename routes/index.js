const express = require('express');
const postRouter = require ('./posts')
const commentRouter = require ('./comments')

const router = express.Router()

router.use('/posts', postRouter)
router.use('/posts', commentRouter)

module.exports = router;