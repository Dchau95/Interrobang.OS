function bankProcess (arrCsv) {
    var arr = arrCsv.split(", ");
    var balance = 0;

//    for (var i=0, t=99; i<t;i++)
//    {
//        var num = Math.floor(Math.random()*200) + 1; // this will get a number between 1 and 200
//        num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
//        arr.push(num)
//    }

    for (var i=0;i<arr.length;i++)
    {
        balance += +arr[i];
    }
    return balance;
}