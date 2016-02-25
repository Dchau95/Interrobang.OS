onmessage = function (event){
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data.toString();
    var result = getFinalVector(arrCsv);
    postMessage(result);
}

function getFinalVector(vectorListCsv) {
    console.log("Starting vector process");
    var vectorList = vectorListCsv.split(", ");
    var finalVector = [0, 0, 0];
    var components = [0, 0, 0];
    for (var i = 0; i < vectorList.length; i++) {
        var currentVector = vectorList[i].split(",");        
        for (var j = 0; j < 3; j++)
            components[j] = currentVector[j].match(/[-]|[.]|\d/g).join("");        
        for (var k = 0; k < 3; k++)
            finalVector[k] += parseFloat(components[k]);
    }
    console.log("Ending vector process");
    return "<" + finalVector + ">";
}