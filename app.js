const express = require('express');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const globalRouter = require('./routes');

// express 객체를 생성한다.
const app = express();
const port = 3000;

//bodyParser의 역할을 한다. => 버퍼 형식을 json으로 변경
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

//const postsRouter = require('./routes/posts');
const connect = require("./schemas");
connect();


app.use("/", globalRouter);

app.listen(port, () => {
  console.log(port, 'OK');
});