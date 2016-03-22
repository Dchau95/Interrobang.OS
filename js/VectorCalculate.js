function getFinalVector(vectorListCsv) {
    console.log("Starting vector process");
    if(typeof vectorListCsv === 'undefined') {
        return "undefined";
    }
    console.log(vectorListCsv);
    var arrVectorList = vectorListCsv.split(", ");
    console.log(arrVectorList);
    var arrFinalVector = [0, 0, 0];
    var components = [0, 0, 0];
    for (var i = 0; i < arrVectorList.length; i++) {
        var currentVector = arrVectorList[i].split(",");        
        for (var j = 0; j < 3; j++)
            components[j] = currentVector[j].match(/[-]|[.]|\d/g).join("");
        for (var k = 0; k < 3; k++)
            arrFinalVector[k] += parseFloat(components[k]);
    }
    console.log("Ending vector process");
    return "<" + arrFinalVector + ">";
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var arrCsv = event.data.data;
    var errorCon = 0;
    var szResult;
    try{
        szResult = getFinalVector(arrCsv);
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var vectorResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    postMessage(vectorResult);
};