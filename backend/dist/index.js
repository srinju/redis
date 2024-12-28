"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
client.connect(); //this mf should be awaited
app.post('/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, userId, code, language } = req.body;
    //push this to database prisma.submisssion.create()
    //push it to the queue , it is like the redis-cli only LPUSH porblems {problem payload with all the probem no  , user id , code , language name ...etc etc}
    try {
        //if there is brpop submissions 0 in the redis queue then when the submission is received then on the redis queue the submisison will appear
        yield client.lPush("submissions", JSON.stringify({ problemId, userId, code, language })); //we are pushing the submission of the problem to the submissions queue from out primary backend , and we are also converting the json to a stirng as redis dosent understand json it only understand string
        res.json({
            message: "submission received!!"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "submission failed!!"
        });
    }
}));
app.listen(3000);
