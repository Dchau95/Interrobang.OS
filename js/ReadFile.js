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
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data;
    var szResult = readFile(arrCsv);
    postMessage(szResult);
};