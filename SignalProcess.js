onmessage = function (e) {
    console.log(e.data);
    //signalprocess(); 
    
    var errorCon = 0;
    
    var signalResult = {
        signalString : "Signaling!",
        processNumberI : e.data.nProcessID,
        errorCon : errorCon
    };
    
    postMessage(signalResult);
}

//function signalprocess()
//{
//	signal = false;
//    return "Signaling to Run";
//}