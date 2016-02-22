/*jslint white: true */
var hashProcessStates = {
    Ready : "Ready",
    Waiting : "Waiting",
    Running : "Running",
    Starting : "Starting",
    Stopping : "Stopping"
};

var currentState = hashProcessStates.Ready;

var arrDirectory = {};

var arrOpenFiles = [
    {
        nProcessID: 0,
        szFileName: "",
        szMode: "",
        nPosition: 0,
        nLength: 0
    }
];

function onMessage(event) {
    var task = event.data;
    
    switch (task.sysCall) {
        case "Open File": {
            arrOpenFiles.push({
                nProcessID: task.ProcessID,
                szFileName: task.fileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: hashDirectory[task.FileName].join("").length()
            });
            task.filePointer = arrProcessesQueue.length - 1;
            postMessage(task);
        } break;
        case "Close File": {
           delete arrOpenFiles[task.filePointer] 
            task.filePointer = 0;
            postMessage(task);
        } break;
        case "Create File": {
            arrOpenFiles.push({
                nProcessID: task.ProcessID,
                szFileName: task.fileName,
                szMode: task.mode,
                nPosition: 0,
                nLength: 0
            });
            task.filePointer = arrProcessesQueue.length - 1;
            postMessage(task);
        } break;
        case "Delete File": {
            //Do something with error code
            postMessage(task);
        } break;
        case "Read File": {
            task.data = arrDirectory[arrOpenFiles[task.filePointer].szFileName][nPosition+1];
            task.length = task.data.length;
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            postMessage(task);
        } break;
        case "Write File": {
            task.length = task.data.length;
            task.position = arrOpenFiles[task.filePointer].nPosition + 1;
            postMessage(task);
        } break;
        case "Length of File": {        
            task.length = arrDirectory[fileName].join("").length();
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
            //EOF function
            postMessage(task);
        } break;
    }
}

this.addEventListener('message', onMessage, false);