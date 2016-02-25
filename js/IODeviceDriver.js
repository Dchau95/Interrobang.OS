/*jslint white: true */

//A hash where each CSV maps to its respective content
var hashDirectory = {
    "Contact.CSV": "David: Secretary, Tony: Gangster, Jason: Dancer, Benson: Duke, Andrew: Gangster, Thomas: Traitor, Matt: Lame",
    "Bank.CSV": "100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000, 100, -50, 200, 300, -1000, 2000",
    "password.CSV": "",
    "read.CSV": "",
    "stats.CSV": "",
    "vector.CSV": ""
};

//An array of hashes, the array signifies which files are currently open. Inside the elements are need
//to know data of the open files.
var arrOpenFiles = [
    {
        szFileName: "",
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: []
    }
];

//The function where the IODevice received its messages from the OS
function onMessage(event) {
    var task = event.data;
    
    switch (task.sysCall) {
        case "Open File": {
            console.log("Opening File");
            arrOpenFiles.push({
                szFileName: task.fileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: (hashDirectory[task.fileName].match(/.{1,100}/g)).length,
                contents: hashDirectory[task.fileName].match(/.{1,100}/g)
            });
            console.log(arrOpenFiles[arrOpenFiles.length-1]);
            postMessage(task);
        } break;
        case "Close File": {
            console.log("Closing File");
           delete arrOpenFiles[task.filePointer]; 
            task.filePointer = -1;
            postMessage(task);
        } break;
        case "Create File": {
            console.log("Creating File");
            hashDirectory[task.fileName] = "";
            arrOpenFiles.push({
                szFileName: task.fileName,
                szMode: task.mode,
                nPosition: 0,
                nLength: 0,
                contents: []
            });
            postMessage(task);
        } break;
        case "Delete File": {
            delete hashDirectory[task.fileName];
            postMessage(task);
        } break;
        case "Read File": {
            console.log("Reading File");
            task.data = arrOpenFiles[task.filePointer].contents[(arrOpenFiles[task.filePointer].nPosition)];
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            arrOpenFiles[task.filePointer].nPosition += 1;
            console.log("This is the data being read " + task.data);
            postMessage(task);
        } break;
        case "Write File": {
            console.log("Writing File");
            console.log(task.data);
            hashDirectory[task.fileName] += ((task.data).match(/.{1,100}/g)).toString();
            console.log("Success, wrote to file");
            task.length = task.data.length;
            task.position = (arrOpenFiles[task.filePointer].nPosition)+ 1;
            postMessage(task);
        } break;
        case "Length of File": {        
            task.length = hashDirectory[task.fileName].length;
            postMessage (task);
        } break;
        case "Seek": {
            arrOpenFiles [task.filePointer].nPosition = task.position;
            postMessage(task);
        } break;
        case "Position of File": {
            //Call Position function
            postMessage(task);
        } break;
        case "End of File": {
            if(arrOpenFiles[task.filePointer].nPosition === arrOpenFiles[task.filePointer].nLength-1)
            {
                console.log("This is the end of the file, says the IO Device");
                console.log("This is the position" + arrOpenFiles[task.filePointer].nPosition);
               task.checkEOF = true; 
            }
                postMessage(task);
        } break;
    }
}

this.addEventListener('message', onMessage, false);