onmessage = function (event){
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data.toString();
    readFile(arrCsv);
    postMessage();
}

function readFile(arrNum) {
    console.log("Starting extra process");
    var arrNumSplit = arrNum.split(", ");
    arrNumSplit.sort();
    return arrNumSplit.join(", ");
    console.log("Ending extra process");
}