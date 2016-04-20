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
    switch(e.data.data)
    {
        case "sleepy":
            console.log("I'm in sleepy")
            sleepResult.sleepString = "!sleepy";
            break;
        case "!sleepy":
            console.log("I'm in !sleepy")
            sleepResult.sleepString = "sleepy";
            break;
        default:
            break;
    }
    postMessage(sleepResult);
}