function findContact(aryContactCsv) {
    "use strict";
    console.log("Starting up contact process");
    if(typeof aryContactCsv === 'undefined') {
        return "undefined";
    }
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
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data;
    var szResult = findContact(arrCsv);
    var contactData = {
        result : szResult,
        processNumberI : event.data.nProcessID
    }
    postMessage(contactData);
};