function bankProcess (arrCsv) {
    var arr = arrCsv.split(", ");
    var balance = 0;

    for (var i=0;i<arr.length;i++)
    {
        balance += +arr[i];
    }
    return balance;
}