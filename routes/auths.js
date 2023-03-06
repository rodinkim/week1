const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../schemas/user");

// 로그인 API
router.post("/login", async (req, res) => {
    try{
    const { nickname, password } = req.body;
        //이메일에 일치하는 유저를 찾는다.
    const user = await User.findOne({ nickname });

        // 1. 이메일에 일치하는 유저가 존재하지 않거나
        // 2. 유저를 찾았지만, 유저의 비밀번호와, 입력한 비밀번호가 다를때,
    if (!user || password !== user.password) {
        res.status(412).json({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
        });
        return;
    }
        //jwt 생성
    const token = jwt.sign({ userId: user.userId },"customized-secret-key");

        res.cookie("Authorization", `Bearer ${token}`); // JWT를 Bearer 타입으로 Cookie로 할당합니다!
        res.status(200).json({ token }); // JWT를 Body로 할당합니다!
    } catch (err) {
        console.log(err);
        res.status(400).send({
        errorMessage: "로그인에 실패하였습니다.",
    });
    }
});

module.exports = router;