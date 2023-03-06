const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  //console.log(req.cookies)
  // ?? 는 null 병합 연산자
  const [authType, authToken] = (Authorization ?? "").split(" ");
  
  
//authType === Baraer값인지 확인
//authToken 검증
  if (authType !== "Bearer" || !authToken) {
    res.status(403).send({
      errorMessage: "로그인이 필요한 기능입니다.",
    });
    return;
  }

  try {
    //authToken이 만료되었는지
    //authToken이 서버가 발급한게 맞는지
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    
    //authToken에 있는 userId에 해당하는 사용자가 실제 DB에 있는지
    const user = await User.findById(userId);
    res.locals.user = user;
    // console.log(user)
    
    next();
  } catch (err) {
    console.error(err);
    res.status(403).send({
      errorMessage: "전달된 쿠키에서 오류가 발생했습니다.",
    });
  }
};
