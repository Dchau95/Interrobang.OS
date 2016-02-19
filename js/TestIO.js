/*global OperatingSystem*/
var contactManager = null;

function testingInputOutput() {
    "use strict";
//    var contactManager = new ContactManager();
//    var test = contactManager.findContact(aryContactCsv);
    //var test = findContact(aryContactCsv);
    var derp = new OperatingSystem();
    derp.main();
    console.log(derp.arrDirectory["test.CSV"]);
}