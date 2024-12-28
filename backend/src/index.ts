import express from 'express';
import {createClient} from "redis";
import { json } from 'stream/consumers';

const app = express();
app.use(express.json());
const client = createClient();
client.connect(); //this mf should be awaited

app.post('/submit' , async (req,res) => {
    const {problemId , userId , code , language} = req.body;
    //push this to database prisma.submisssion.create()
    //push it to the queue , it is like the redis-cli only LPUSH porblems {problem payload with all the probem no  , user id , code , language name ...etc etc}
    try {
        //if there is brpop submissions 0 in the redis queue then when the submission is received then on the redis queue the submisison will appear
        await client.lPush("submissions" , JSON.stringify({problemId , userId , code , language})); //we are pushing the submission of the problem to the submissions queue from out primary backend , and we are also converting the json to a stirng as redis dosent understand json it only understand string
        res.json({
            message : "submission received!!"
        });
    } catch (error) {
        res.status(500).json({
            message : "submission failed!!"
        });
    }
});

app.listen(3000);