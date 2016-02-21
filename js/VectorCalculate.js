var arrayOfVectorsCSV = ["<15.6,7.5,-15.3>", "<-16.7,-3.8,6.8>",
    "<-8.6,2.8,-11>", "<-0.9,16.8,-9.7>", "<-3.7,6,6.7>",
    "<13.5,7.4,17.1>", "<-18,-18.2,16.6>", "<-0.6,9.1,17.4>",
    "<12.8,-19.3,14.6>", "<4.6,-4.3,-1.5>", "<6,-13.5,-13.9>",
    "<10.7,-10.2,2.3>", "<-2.4,-3.6,-14.9>", "<1.8,10.8,17.1>",
    "<12.1,-12.9,-1.6>", "<-1.2,-19.3,-19>", "<-8.9,-17.3,-17.1>",
    "<-12.3,2.2,12>", "<-19.6,-9.8,8>", "<15,14.8,18.9>"];

function getFinalVector(vectorListCsv) {
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
    return "<" + finalVector + ">";
}