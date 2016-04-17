function scriptProcess (arrCsv) {
    console.log("Starting up Script Process");
    var arr = arrCsv.split(", ");
    var commands = [];
    for (var i=0;i<arr.length;i++)
    {
         commands.push(arr[i]);
    }
    console.log("Commands: " + commands);
    return commands.join('');
}

//The function that signifies the message received from the OS.
onmessage = function (event){
    var errorCon = 0;
    var arrCsv = event.data.data;
    var nResult;
    try{
       nResult = scriptProcess(arrCsv);
    } catch(err){
        nResult = "";
        errorCon = -1;
    }
    var scriptResult = {
        result : nResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    };
    postMessage(scriptResult);
}