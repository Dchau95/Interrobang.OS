onmessage = function (event){
    console.log("Got the message");
    console.log(event.data.data);
    //var arrCsv = event.data.data.join("");
    var result = bankProcess(event.data.data);
    postMessage(result);
}

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
    return balance.toString();
}