onmessage = function (event){
    console.log("Doing process");
	//Send in mutex info
	var processData = {
		processNumberI : event.data.nProcessID,
		arrayIndex : event.data.characterCode-32,
		character : String.fromCharCode(event.data.characterCode),
	}
    postMessage(processData);
}
