function getFinalVector(vectorListCsv) {
    console.log("Starting vector process");
    if(typeof vectorListCsv === 'undefined') {
        return "undefined";
    }
    var arrVectorList = vectorListCsv.split(", ");
    var arrFinalVector = [0, 0, 0];
    var components = [0, 0, 0];
    for (var i = 0; i < vectorList.length; i++) {
        var currentVector = vectorList[i].split(",");        
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
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data.toString();
    var szResult = getFinalVector(arrCsv);
    postMessage(szResult);
};