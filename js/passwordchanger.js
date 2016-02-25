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

onmessage = function (event){
    console.log(event);
    console.log(event.data);
    console.log(event.data.data);
    console.log("Got the message");
    var arrCsv = event.data.data;
    var result = passwordChanger(arrCsv);
    postMessage(result);
}

function passwordChanger(usrpwdlist){
    console.log("Starting password process");
    var username = "gamrgod88";
    var password = "l337420";
	var delimiters = /[,/:]/;
	var usrpwdsplit = usrpwdlist.split(delimiters);
	var returnstr = "";
	for (i = 0; i < usrpwdsplit.length; i+= 2 ){
		if (usrpwdsplit[i] == username){
			usrpwdsplit[i+1] = password;
		}
		returnstr = returnstr + usrpwdsplit[i] + ":" + usrpwdsplit[i+1] + ",";
	}
    console.log("Ending password process");
	return returnstr;
}
