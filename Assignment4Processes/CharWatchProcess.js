onmessage = function (event){
    console.log("Doing process");
	//Send in mutex info
	var processData = {
		processNumberI : event.data.nProcessID,
		arrayIndex : event.data.character.charCodeAt(0)-32,
		character : event.data.character,
	}
    postMessage(processData);
}
