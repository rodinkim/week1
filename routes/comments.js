const express = require("express")
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

//댓글 생성
router.post("/:_postId/comments", authMiddleware, async(req,res) => {
  try{
    const {_postId} = req.params;
    const {usersId} = res.locals.user
    const {nickname} = res.locals.user;
    const maxOrderByCommentId = await Comment.findOne().sort("-commentId").exec();
    const commentId = maxOrderByCommentId ? maxOrderByCommentId.commentId + 1 : 1 ;
    const {comment} = req.body;
    const postId = _postId;
  
    if(!_postId ){
      return res.status(404).json({
        success:false,
        errorMessage:"게시글이 존재하지 않습니다.",
      });
    }

  await Comment.create({commentId, usersId, nickname, comment, postId });
  
  res.json({message: "댓글을 작성했습니다."});
  } catch (err) {
    console.log(err);
    res.status(400).send({
    errorMessage: "댓글 작성에 실패했습니다.",
  });
  }
});

// 댓글 목록 조회
router.get("/:_postId/comments", authMiddleware, async(req,res) => {
  try {
    // const comments = await Comment.find({}).sort({"createdAt":-1});
    const {_postId} = req.params;
    const comments = await Comment.find({postId:Number(_postId)});
    const result = comments.map((comment) => {
      return {
        commentId: comment.commnetId,  
        userId: comment.usersId,
        nickname: comment.nickname,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      }
    })
      res.json({"comments" : result,});
    } catch (err) {
    console.log(err);
    res.status(400).send({
    errorMessage: "댓글 조회에 실패했습니다.",
  });
  }
});

//댓글 수정
router.put("/:_postId/comments/:_commentId", authMiddleware, async(req,res) => {
  try {
    const {_postId} = req.params;
    const {_commentId} = req.params;
    const {usersId} = res.locals.user;
    const {comment} = req.body;
    const [data] = await Comment.find({commentId:_commentId});
    
    if(data.usersId !== usersId){
      return res.status(403).json({
        success:false,
        errorMessage:"댓글 수정의 권한이 존재하지 않습니다.",
      });
    }
    if (!req.body.comment){
      return res.status(412).json({
        success: false,
        errorMessage: "데이터 형식이 올바르지 않습니다.",
      })
    }
    await Comment.updateOne(
      {commentId:_commentId},
      {$set: {comment:comment}}
    )
    
    res.json({message: "댓글을 수정했습니다."});
    } catch (err) {
      console.log(err);
      res.status(400).send({
      errorMessage: "댓글 수정에 실패했습니다.",
    });
    }
  });

//댓글 삭제
router.delete("/:_postId/comments/:_commentId", authMiddleware, async(req,res) => {
  try {  
      const {_postId} = req.params;
      const {_commentId} = req.params;
      const {usersId} = res.locals.user;
      const [data] = await Comment.find({commentId:_commentId});
      if(data.usersId !== usersId){
        return res.status(403).json({
          success:false,
          errorMessage:"댓글 삭제의 권한이 존재하지 않습니다.",
        });
      }
      await Comment.deleteOne({commentId:_commentId});
      res.json({message: "댓글을 삭제했습니다."});
   } catch (err) {
    console.log(err);
    res.status(400).send({
    errorMessage: "댓글 수정에 실패했습니다.",
    });
    }
});
module.exports = router;