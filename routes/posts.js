const express = require("express")
const router = express.Router();
const Post = require("../schemas/post.js");

//게시글 작성 
router.post("/", async(req,res) => {
  const {title, user, password, contents} = req.body;
  const createdPosts = await Post.create({title, user, password, contents});
  res.json({message: "게시글을 생성했습니다."});
});

// 게시글 전체 조회
  router.get("/", async(req,res) => {
    const posts = await Post.find({}).sort({"createdAt":-1});
    const result = posts.map((post) => {
        return {
            title: post.title,
            user: post.user,
            createdAt: post.createdAt
        }
    })
    res.json({
        "data" : result,
    });
  });

//게시글 상세 조회 API
  router.get("/:_postId", async(req,res) => {
    const {_postId} = req.params;
    const data = await Post.find({_id:_postId});
    res.json({data});
  });

//게시글 수정
  router.put("/:_postId", async(req,res) => {
    const {_postId} = req.params;
    const {password, title, contents} = req.body;
    const [data] = await Post.find({_id:_postId});

    if (data.password != password){
      return res.status(400).json({
        success:false,
        errorMessage:"패스워드가 다릅니다.",
      });
    }
    await Post.updateOne(
      {_id:_postId},
      {$set: {title:title}}
    )
    await Post.updateOne(
      {_id:_postId},
      {$set: {contents:contents}}
    )
    res.json({message: "게시글을 수정했습니다."});
  })

  //게시글 삭제
  router.delete("/:_postId", async(req,res) => {
    const {_postId} = req.params;
    const {password} = req.body;
    const [data] = await Post.find({_id:_postId});
    if (data.password != password){
      return res.status(400).json({
        success:false,
        errorMessage:"패스워드가 다릅니다.",
      });
    }
    if(true){
      await Post.deleteOne({_id:_postId});
    }
    
    res.json({message: "게시글을 삭제했습니다."});
  })

  
module.exports = router;