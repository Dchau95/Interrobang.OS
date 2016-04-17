/*	By: Andrew Goff
*	For: CSC415-02 with Mike Fuhrman
*	Simple Javascript function that will be used as a process in our OS project. 			*/

/*	This function takes in a string of usernames and passwords seperated by some delimeters,
*	checks for a specific username, changes that usernames password, and returns the string
*	with the changed password.																*/

/*	Arguement list
*	usrpwdlist: A string of our usernames and passwords, seperated by the delimiters : and ,.
*		An example might be "agoff:pword12,mfuhrman:original,cesse:losgatos"
*	username: The username that corresponds to the password you wish to change.
*	password: What you want to change the password to for the respective username.
*
*	Returns
*	A string similar to the usrpwdlist string passed in, but with the password changed
*	for the appropriate username															*/

function passwordChanger(usrpwdlist) {
//    if(typeof usrpwdlist === 'undefined') {
//        return "undefined";
//    }
    console.log("Starting password process");
    var szUsername = "gamrgod88";
    var szPassword = "l337420";
	var szDelimiters = /[,/:]/;
	var arrUsrpwdsplit = usrpwdlist.split(szDelimiters);
	var szReturnstr = "";
	for (var i = 0; i < arrUsrpwdsplit.length; i += 2) {
		if (arrUsrpwdsplit[i] === szUsername) {
			arrUsrpwdsplit[i + 1] = szPassword;
            return arrUsrpwdsplit[i] + ":" + arrUsrpwdsplit[i + 1]
		}
	}
    console.log("Ending password process");
	return szReturnstr;
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult;
    try{ 
        szResult = passwordChanger(arrCsv);
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var passwordResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon: errorCon
    }
    postMessage(passwordResult);
};
