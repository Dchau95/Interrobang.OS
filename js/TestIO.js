/*global OperatingSystem*/
var contactManager = null;

function testingInputOutput() {
    "use strict";
//    var contactManager = new ContactManager();
//    var test = contactManager.findContact(aryContactCsv);
    //var test = findContact(aryContactCsv);
    var test = new OperatingSystem();
    test.create("test.CSV", "helo heloo helo heloo helo heloo helo heloo helo heloo");
    console.log(arrDirectory["test.CSV"]);
}