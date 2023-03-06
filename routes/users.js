const express = require("express")
const router = express.Router();
const User = require("../schemas/user.js");


// 회원가입 API
router.post("/signup", async (req, res) => {
    try {
        const { nickname, password, confirm } = req.body;
        const regexNickInPass = new RegExp(nickname);
        const regexNumorAlpha = /^[a-zA-Z0-9]*$/;
        const maxOrderByUserId = await User.findOne().sort("-usersid").exec();
        const usersId = maxOrderByUserId ? maxOrderByUserId.usersId + 1 : 1;
        if (!regexNumorAlpha.test(nickname) || nickname.length < 3){
            res.status(412).json({
            errorMessage: "닉네임의 형식이 일치하지 않습니다.",
            });
            return;
        }
        if (password !== confirm) {
            res.status(412).json({
            errorMessage: "패스워드가 일치하지 않습니다.",
            });
            return;
        }
        if (password.length < 4) {
            res.status(412).json({
            errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
            return;
        }
        if(regexNickInPass.test(password)){
            res.status(412).json({
            errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
            return;
        }
        const existsUsers = await User.findOne({ nickname });
        
        if (existsUsers) {
            res.status(412).json({
            errorMessage: "중복된 닉네임입니다.",
            });
            return;
        }
    
        const user = new User({ nickname, password, usersId });
        await user.save();
        res.status(201).json({message: "회원 가입에 성공하였습니다."});
    } catch (err) {
        console.log(err);
        res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
    }
});


module.exports = router;