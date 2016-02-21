function readFile(arrNum) {
    var arrNumSplit = arrNum.split(", ");
    arrNumSplit.sort();
    return arrNumSplit.join(", ");
}