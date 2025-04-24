// expressというフレームワークを読み込む
const express = require("express");
const app = express();

// express-session(セッション管理)モジュールを読み込む
const session = require("express-session");

// fs(ファイルシステム)モジュールを読み込む
const fs = require("fs");

// ファイルパスを操作するためのpathモジュールを読み込む
const path = require("path");

// テンプレートエンジンの設定
app.set("view engine", "ejs");

// publicディレクトリ内のファイルをWebサーバ経由で提供できるようにする
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

// セッションの設定
app.use(session({
    secret : 'quiz_secret',
    resave : false,
    saveUninitialized : true
}));

// クイズデータの読み込み
const quizData = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));

// GETリクエストがホームページに送られた時の処理
// クイズの表示ページに遷移する
app.get("/", (req, res) => {
    req.session.index = 0;
    req.session.score = 0;
    const quiz = quizData[0];
    res.render("index", {quiz});
});

// POSTリクエストが回答ページに送られた時の処理
app.post("/answer", (req, res) => {
    const userAnswer = req.body.answer;
    const currentIndex = req.session.index;
    const quiz = quizData[currentIndex];

    // 正答かを判定
    const correct = quiz.answer === userAnswer;
    if(correct)
        req.session.score += 1;

    req.session.index += 1;

    if(req.session.index >= quizData.length){
        res.redirect("/finish");
    }
    else{
        const nextQuiz = quizData[req.session.index];
        res.render("index", {quiz : nextQuiz});
    }  
});

// 終了画面への遷移
app.get("/finish", (req, res) => {
    const score = req.session.score;
    const total = quizData.length;
    res.render("finish", {score, total});
})

// 3000番ポートでアプリを起動
app.listen(3000, () => {
    console.log("http://localhost:3000で起動");
})