function checkUserPassword(userPass, userFile) {
    for(var i = 0; i<userFile.length; i++) {
        if(userPass === userFile[i]) {
            return true;
        }
    }
    return false;
}

onmessage = function(event) {
    var username = event.data.username;
    var password = event.data.password;
    var userFile = event.data.fileCsv.split(",");
    
    var errorCon = 0;
    var logInResult = {
        result : false,
        processNumberI : event.data.nProcessID,
        errorCon : errorCon
    }
    var up = username+":"+password;
    console.log(up);
    console.log(userFile);
    logInResult.result = checkUserPassword(up, userFile);

    postMessage(logInResult);
}