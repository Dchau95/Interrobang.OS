function Starter(){
    return true;
}


//Message recieved from the OS
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult; 
    try{
        szResult = Starter();
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var starterResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    postMessage(starterResult);
};