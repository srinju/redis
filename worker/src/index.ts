import { createClient } from "redis";

//this workers basically run infinitely and keeps poling from the queue , as do u have something ? again and again 

const client = createClient();

async function worker(){
    await client.connect();
    while(1){
        const response = await client.brPop("submissions" , 0); //doing BRPOP submission 0  that means the pop is blocked for infinite time till a new payload comes to be popped
        console.log("response we are getting back after we pop from the redis queue is :  " , response);
        //run the users code(in a real life application)
        //we are simulating an expensive operation by awaiting and a promise resolve for 1 second duraration
        await new Promise((resolve) => setTimeout(resolve,1000)); //await a new promise which will be resolved under 1 second
        //then send it to the pub sub 
        console.log("processed user's submission");
        //now if we start multiple workers and then 
        //we send postman requests with body
        //then we will see that the payloads are getting picked up by the random workers
    }
}
worker();
