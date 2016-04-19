function mather(inputFile) {
	var inputFileSplit = inputFile.split(", ").map(Number);
    var added = 0 + inputFileSplit[0];
    var subtracted = 0 + inputFileSplit[0];
    var multiplied = 0 + inputFileSplit[0];
    var divided = 0 + inputFileSplit[0];
	for (var i = 1; i < inputFileSplit.length; i++) {
		added = added + inputFileSplit[i];
        subtracted = subtracted - inputFileSplit[i];
        multiplied = multiplied * inputFileSplit[i];
        if (inputFileSplit[i] === 0){
            divided = "Divide by zero error";
        } else {
        divided = divided / inputFileSplit[0];
        }
	}
    console.log("ENDING MATHER PROCESS");
	return ("Total when added together = " + added + "; Total when subtracted from each other = " + subtracted + "; Total when multipled together = " + multiplied + "; Total when 1 is divided by each number " + divided + "; Total numbers counted = " + inputFileSplit.length);
}

//The function that signifies the message received from the OS.
onmessage = function (event) {
    var errorCon = 0;
    var arrCsv = event.data.data;
    var szResult;
    try{ 
        szResult = mather(arrCsv);
    }catch(err){
        szResult = "error";
        errorCon = -1;
    }
    console.log(szResult);
    var matherResult = {
        result : szResult,
        processNumberI : event.data.nProcessID,
        errorCon: errorCon
    }
    console.log("At end of onmesage");
    postMessage(matherResult);
    console.log("Message posted");
};
