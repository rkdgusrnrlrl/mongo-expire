const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db;

function connectionMongo() {
    return MongoClient.connect(url)
            .then(conn =>{
                return conn.db("test")
            })
            .then(dbConnected => {
                db = dbConnected;
            });
}

//캐쉬 안되게 막음 => 안됨 ㅠㅠ
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/', async (req, res) => {
    try {
        const logList = await db.collection("logs").find({}).toArray();
        res.json(logList);
    } catch (e) {
        console.error(e);
        res.send(e);
    }

});

app.get('/enter', async (req, res) => {
    try {
        await db.collection("logs").insert({event : "enter", date : new Date()});
        res.json({ok : true});
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

app.get('/exit', async (req, res) => {
    try {
        await db.collection("logs").insert({event : "exit", date : new Date()});
        res.json({ok : true});
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

app.get('/coding', async (req, res) => {
    try {
        await db.collection("logs").insert({event : "coding", date : new Date()});
        res.json({ok : true});
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

app.get('/playing', async (req, res) => {
    try {
        await db.collection("logs").insert({event : "playing", date : new Date()});
        res.json({ok : true});
    } catch (e) {
        console.error(e);
        res.send(e);
    }
});

//몽고DB 접속 => expire 인덱스를 만들어줌 =>서버실행
connectionMongo()
    .then(() => {
        //expire 인데스를 만들어 줌
        return db.collection("logs").createIndex({"date": 1}, {expireAfterSeconds : 10});
    })
    .then(() => app.listen(3000));


