/*jslint white: true */
var hashProcessStates = {
    Ready : "Ready",
    Waiting : "Waiting",
    Running : "Running",
    Starting : "Starting",
    Stopping : "Stopping"
};

var currentState = hashProcessStates.Ready;

var hashDirectory = {
    "Bank.CSV": "100, -50, 200, 300, -1000, 2000"
};

var arrOpenFiles = [
    {
        nProcessID: 0,
        szFileName: "",
        szMode: "",
        nPosition: 0,
        nLength: 0,
        contents: [],
    }
];

function onMessage(event) {
    var task = event.data;
    
    switch (task.sysCall) {
        case "Open File": {
            console.log("Pushing pushing");
            arrOpenFiles.push({
                nProcessID: task.ProcessID,
                szFileName: task.fileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: hashDirectory[task.fileName].match(/.{1,100}/g).length,
                contents: hashDirectory[task.fileName].match(/.{1,100}/g)
            });
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
            arrOpenFiles.push({
                nProcessID: task.ProcessID,
                szFileName: task.fileName,
                szMode: task.mode,
                nPosition: 0,
                nLength: 0
            });
            //task.filePointer = arrProcessesQueue.length - 1;
            postMessage(task);
        } break;
        case "Delete File": {
            //Do something with error code
            delete hashDirectory[task.fileName];
            postMessage(task);
        } break;
        case "Read File": {
            console.log(task.filePointer);
            task.data = arrOpenFiles[task.filePointer].contents;
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            arrOpenFiles[task.filePointer].nPosition += 1;
            postMessage(task);
        } break;
        case "Write File": {
            task.length = task.data.length;
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            postMessage(task);
        } break;
        case "Length of File": {        
            task.length = hashDirectory[fileName].length;
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
            if(arrOpenFiles[task.filePointer].nPosition === arrOpenFiles[task.filePointer].length)
            {
               task.checkEOF = true; 
            }
                postMessage(task);
        } break;
    }
}

this.addEventListener('message', onMessage, false);