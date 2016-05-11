// p1 p2, 
// p1 starts, waits
// p2 signal,
// p1 sleep,
onmessage = function (e) {
    console.log(e.data);
    
    var errorCon = 0;
    
    var sleepResult = {
        sleepString : "",
        processNumberI : e.data.nProcessID,
        errorCon : errorCon
    };
    if(e.data.data === "!sleepy")
    {
        console.log("I'm in !sleepy")
        sleepResult.sleepString = "sleepy";
    }
    else
    {
        console.log("I'm in sleepy")
        sleepResult.sleepString = "!sleepy";
    }
    postMessage(sleepResult);
}