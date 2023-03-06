const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();
const Post = require("../schemas/post.js");
const User = require("../schemas/user.js");
const jwt = require("jsonwebtoken");

//게시글 작성 
router.post("/", authMiddleware, async(req,res) => {
  try{
      const maxOrderByPostId = await Post.findOne().sort("-postId").exec();
      const postId = maxOrderByPostId ? maxOrderByPostId.postId + 1 : 1;
      const {usersId} = res.locals.user
      const {nickname} = res.locals.user;
      const {title, content} = req.body;
      // const {nickname} = res.locals.nickname;
      
      if (!req.body.title && !req.body.content){
        return res.status(412).json({
          success: false,
          errorMessage: "데이터 형식이 올바르지 않습니다.",
        })
      }
      if (!title){
        return res.status(412).json({
          success: false,
          errorMessage: "게시글 제목의 형식이 일치하지 않습니다.",
        })
      }
      if (!content){
        return res.status(412).json({
          success: false,
          errorMessage: "게시글 내용의 형식이 일치하지 않습니다.",
        })
      }
      await Post.create({ usersId, title, content, nickname, postId});
      return res.status(201).json({Message: "게시글 작성에 성공했습니다."})
    } catch (err) {
    console.log(err);
    res.status(400).send({
    errorMessage: "게시글 작성에 실패했습니다.",
  });
  }
});


// 게시글 전체 조회
  router.get("/", async(req,res) => {
    try {
      const posts = await Post.find({}).sort({"createdAt":-1});
      const result = posts.map((post) => {
          return {
              postId: post.postId,
              userId: post.usersId,
              nickname: post.nickname,
              title: post.title,
              content: post.content,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
            }
      })
      res.json({
          "posts" : result,
      });
      } catch (err) {
      console.log(err);
      res.status(400).send({
      errorMessage: "게시글 조회에 실패했습니다.",
    });
  }
});

//게시글 상세 조회 API
  router.get("/:_postId", async(req,res) => {
    try {
      const {_postId} = req.params;
      const posts = await Post.find({postId:Number(_postId)});
      if (Number(_postId) !== posts.postId){
      const result = posts.map((post) => {
          return {
              postId: post.postId,
              userId: post.usersId,
              nickname: post.nickname,
              title: post.title,
              content: post.content,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt
          }
      });
      res.json({
        "posts" : result,
      });
      }
      } catch (err) {
        console.log(err);
        res.status(400).send({
        errorMessage: "게시글 조회에 실패했습니다.",
      });
    }
  });

//게시글 수정
  router.put("/:_postId", authMiddleware, async(req,res) => {
    try{
    const {_postId} = req.params;
    const {usersId} = res.locals.user;
    const {title, content} = req.body;
    const [data] = await Post.find({postId:_postId});

    if(data.usersId !== usersId){
      return res.status(403).json({
        success:false,
        errorMessage:"게시글 수정의 권한이 존재하지 않습니다.",
      });
    }
    if (!req.body.title && !req.body.content){
      return res.status(412).json({
        success: false,
        errorMessage: "데이터 형식이 올바르지 않습니다.",
      })
    }
    if (!title){
      return res.status(412).json({
        success: false,
        errorMessage: "게시글 제목의 형식이 일치하지 않습니다.",
      })
    }
    if (!content){
      return res.status(412).json({
        success: false,
        errorMessage: "게시글 내용의 형식이 일치하지 않습니다.",
      })
    }
    await Post.updateOne(
      {postId:_postId},
      {$set: {title:title}}
    )
    await Post.updateOne(
      {postId:_postId},
      {$set: {content:content}}
    )
    res.json({message: "게시글을 수정했습니다."});
  } catch (err) {
      console.log(err);
      res.status(400).send({
      errorMessage: "게시글 수정에 실패했습니다.",
    });
  }
  })
  
  //게시글 삭제
  router.delete("/:_postId", authMiddleware, async(req,res) => {
    try {
    const maxOrderByPostId = await Post.findOne().sort("-postId").exec();
    console.log(maxOrderByPostId.postId)
    const {_postId} = req.params;
    const {usersId} = res.locals.user;
    const [data] = await Post.find({postId:_postId});
    
    if(!_postId ){
      return res.status(404).json({
        success:false,
        errorMessage:"게시글이 존재하지 않습니다.",
      });
    }

    if(data.usersId !== usersId){
      return res.status(403).json({
        success:false,
        errorMessage:"게시글 삭제 권한이 존재하지 않습니다.",
      });
    }
    
    await Post.deleteOne({postId:_postId});
    
    res.json({message: "게시글을 삭제했습니다."});
    } catch (err) {
      console.log(err);
      res.status(400).send({
      errorMessage: "게시글 삭제에 실패했습니다.",
    });
    }
});

  
module.exports = router;