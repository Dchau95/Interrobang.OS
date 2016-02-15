//Two different ways of creating a function and making it belong to the class


//function ContactManager() {
//    this.findContact = function() {
//        "use strict";
//        var szContact = "Matt Wischoff";
//        var nIndex;
//        for (nIndex = 0; nIndex < aryContactCsv.length; nIndex++) {
//            if (szContact === aryContactCsv[nIndex]) {
//                return szContact;
//            }
//        }
//    }
//}

function findContact(aryContactCsv) {
    "use strict";
    var szContact = "Matt Wischoff";
    var nIndex;
    for (nIndex = 0; nIndex < aryContactCsv.length; nIndex++) {
        if (szContact === aryContactCsv[nIndex]) {
            return szContact;
        }
    }
}

//ContactManager.prototype.findContact = function(aryContactCsv) {
//    "use strict";
//    var szContact = "Matt Wischoff";
//    var nIndex;
//    for (nIndex = 0; nIndex < aryContactCsv.length; nIndex++) {
//        if (szContact === aryContactCsv[nIndex]) {
//            return szContact;
//        }
//    }
//}