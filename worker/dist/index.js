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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
//this workers basically run infinitely and keeps poling from the queue , as do u have something ? again and again 
const client = (0, redis_1.createClient)();
function worker() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        while (1) {
            const response = yield client.brPop("submissions", 0); //doing BRPOP submission 0  that means the pop is blocked for infinite time till a new payload comes to be popped
            console.log("response we are getting back after we pop from the redis queue is :  ", response);
            //run the users code(in a real life application)
            //we are simulating an expensive operation by awaiting and a promise resolve for 1 second duraration
            yield new Promise((resolve) => setTimeout(resolve, 1000)); //await a new promise which will be resolved under 1 second
            //then send it to the pub sub 
            console.log("processed user's submission");
        }
    });
}
worker();
