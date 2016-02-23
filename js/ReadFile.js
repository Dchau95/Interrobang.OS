function readFile(arrNum) {
    console.log("Starting extra process");
    var arrNumSplit = arrNum.split(", ");
    arrNumSplit.sort();
    return arrNumSplit.join(", ");
    console.log("Ending extra process");
}