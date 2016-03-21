function bankProcess (arrCsv) {
    console.log("Starting up bankprocess");
    console.log(arrCsv);
    var arr = arrCsv.split(", ");
    var balance = 0;

    for (var i=0;i<arr.length;i++)
    {
        balance += +arr[i];
    }
    console.log("Finishing up bank process");
    console.log("Total balance: " + balance);
    return balance;
}

//The function that signifies the message received from the OS.
onmessage = function (event){
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var errorCon = 0;
    var arrCsv = event.data.data;
    var nResult;
    try{
       nResult = bankProcess(arrCsv);
    } catch(err){
        nResult = "";
        errorCon = -1;
    }
    var bankResult = {
        result : nResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    };
    postMessage(bankResult);
}