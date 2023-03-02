const express = require("express")
const router = express.Router();
const Post = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

//댓글 생성
router.post("/:_postId/comments", async(req,res) => {
    const {_postId} = req.params;
    const {user, password, contents} = req.body;
    if (contents.length === 0){
      return res.status(400).json({
        success:false,
        errorMessage:"댓글 내용을 입력해주세요.",
      }); 
    }
  const createdComment = await Comment.create({user, password, contents});
  res.json({message: "댓글을 생성했습니다."});
});

// 댓글 목록 조회
router.get("/:_postId/comments", async(req,res) => {
    const comments = await Comment.find({}).sort({"createdAt":-1});
    const result = comments.map((comment) => {
        return {
          commentId: comment._id,  
          user: comment.user,
          content: comment.contents,
          createdAt: comment.createdAt
        }
    })
    res.json({
        "data" : result,
    });
});

//댓글 수정
router.put("/:_postId/comments/:_commentId", async(req,res) => {
  const {_postId} = req.params;
  const {_commentId} = req.params;
  const {password, contents} = req.body;
  const [data] = await Comment.find({_id:_commentId});
  if (contents.length === 0){
    return res.status(400).json({
      success:false,
      errorMessage:"댓글 내용을 입력해주세요.",
    }); 
  }
  if (data.password != password){
    return res.status(400).json({
      success:false,
      errorMessage:"패스워드가 다릅니다.",
    });
  }
  await Comment.updateOne(
    {_id:_commentId},
    {$set: {contents:contents}}
  )
  
  res.json({message: "댓글을 수정했습니다."});
})

//댓글 삭제
router.delete("/:_postId/comments/:_commentId", async(req,res) => {
  const {_postId} = req.params;
  const {_commentId} = req.params;
  const {password} = req.body;
  const [data] = await Comment.find({_id:_commentId});
  if (data.password != password){
    return res.status(400).json({
      success:false,
      errorMessage:"패스워드가 다릅니다.",
    });
  }
  if(true){
    await Comment.deleteOne({_id:_commentId});
  }
  
  res.json({message: "댓글을 삭제했습니다."});
})
module.exports = router;