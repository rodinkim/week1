const express = require('express');
const postRouter = require ('./posts')
const commentRouter = require ('./comments')
const userRouter = require ('./users')
const authRouter = require ('./auths')

const router = express.Router()

router.use('/posts', postRouter)
router.use('/posts', commentRouter)
router.use('/', userRouter)
router.use('/',  authRouter)

module.exports = router;