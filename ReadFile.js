function readFile(arrNum) {
    console.log("Starting extra process");
    console.log(arrNum);
    if(typeof arrNum === 'undefined') {
        return "undefined";
    }
    var arrNumSplit = arrNum.split(", ").map(Number);
    arrNumSplit.sort(function(a, b){return a-b});
    return arrNumSplit.join(", ");
    console.log("Ending extra process");
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult;
    try{
        szResult = readFile(arrCsv);
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var readResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    postMessage(readResult);
};