/*jslint white: true */
var hashDirectory = {};

var arrOpenFiles = [];

var arrProcessesQueue = [
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
            arrOpenFiles.push(task.FileName);
            arrProcessesQueue.push({
                nProcessID: task.ProcessID,
                szFileName: task.FileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: hashDirectory[task.FileName].join("").length()
            });
        } break;
        case "Close File": {
            arrOpenFiles.splice(arrOpenFiles.indexOf(task.FileName), 1);
        } break;
        case "Create File": {
            arrOpenFiles.push(task.FileName);
            arrProcessesQueue.push({
                nProcessID: task.ProcessID,
                szFileName: task.FileName,
                szMode: task.Mode,
                nPosition: 0,
                nLength: 0
            });
        } break;
        case "Delete File": {
            //Do something with error code
        } break;
        case "Read File": {
            
        } break;
        case "Write File": {
            
        } break;
        case "Length of File": {
            
        } break;
        case "Seek": {
            
        } break;
        case "Position of File": {
            
        } break;
        case "End of File": {
            
        } break;
    }
}

this.addEventListener('message', onMessage, false);