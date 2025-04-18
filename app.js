// expressというフレームワークを読み込む
const express = require("express");
const app = express();

// fs(ファイルシステム)モジュールを読み込む
const fs = require("fs");

// ファイルパスを操作するためのpathモジュールを読み込む
const path = require("path");

// テンプレートエンジンの設定
app.set("view engine", "ejs");

// publicディレクトリ内のファイルをWebサーバ経由で提供できるようにする
app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

// クイズデータの読み込み
const quizData = JSON.parse(fs.readFileSync("./questions.json", "utf-8"));

// GETリクエストがホームページに送られた時の処理
// クイズの表示ページに遷移する
app.get("/", (req, res) => {
    const quiz = quizData[0];
    res.render("index", {quiz});
});

// POSTリクエストが回答ページに送られた時の処理
app.post("/answer", (req, res) => {
    const userAnswer = req.body.answer;
    const correct = quizData[0].answer === userAnswer;
    res.render("result", {correct, answer : quizData[0].answer});    
});

// 3000番ポートでアプリを起動
app.listen(3000, () => {
    console.log("http://localhost:3000で起動");
})