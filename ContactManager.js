function findContact(aryContactCsv) {
    "use strict";
    console.log("Starting up contact process");
    var arrSplitContact = aryContactCsv.split(", ");
    var szContact = "Thomas";
    var arrContact = {};
    for (var nIndex = 0; nIndex<arrSplitContact.length; nIndex++){
        var temp = arrSplitContact[nIndex].split(": ");
        arrContact[temp[0]] = temp[1];
    }
    if (szContact in arrContact){
        console.log("Returning string");
        return szContact;
    }
    console.log("pausing contact process");
    return "";
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult; 
    try{
        szResult = findContact(arrCsv);
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var contactData = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    postMessage(contactData);
};
