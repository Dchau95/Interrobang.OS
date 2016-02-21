function findContact(aryContactCsv) {
    "use strict";
    var str = aryContactCsv.split(", ");
    var szContact = "Matt Wischoff";
    var arrContact = {};
    for (var nIndex = 0; nIndex<str.length; nIndex++){
        var temp = str[nIndex].split(": ");
        arrContact[temp[0]] = temp[1];
    }
    if (szContact in arrContact){
        return szContact;
    }
}
