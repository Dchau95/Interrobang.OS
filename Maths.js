function mather(inputFile) {
    console.log("Starting mather process");
	var szDelimiters = /[,/:]/;
	var inputFileSplit = inputFile.split(szDelimiters);
	var szReturnstr = "";
    var added = inputFileSplit[0];
    var subtracted = inputFileSplit[0];
    var multiplied = inputFileSplit[0];
    var divided = inputFileSplit[0];
	for (var i = 1; i < inputFileSplit.length; i++) {
		added = added + inputFileSplit[i];
        subtracted = subtracted - inputFileSplit[i];
        multiplied = multiplied * inputFileSplit[i];
        if (divided === 0){
            divided = "Divide by zero error";
        } else {
        divided = divided / inputFileSplit[0];
        }
	}
    console.log("Ending mather process");
    commandOuput("Here");
	return ("Total when added together = " + added + "; Total when subtracted from each other = " + subbed + "; Total when multipled together = " + multiplied + "; Total when 1 is divided by each number" + divided + "; Total numbers counted = " + inputFileSplit.length);
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult;
    try{ 
        szResult = mather(arrCsv);
    }catch(err){
        szResult = "";
        errorCon = -1;
    }
    var matherResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon: errorCon
    }
    postMessage(matherResult);
};
