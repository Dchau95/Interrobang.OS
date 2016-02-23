var hashProcessStates = {
    Ready : "Ready",
    Waiting : "Waiting",
    Running : "Running",
    Starting : "Starting",
    Stopping : "Stopping"
};

var IOStop = 1;
var firstToStopWaiting = 0;

var statesQueue = [
    { process1 : "Waiting" },
    { process2 : "Waiting" },
    { process3 : "Waiting" },
    { process4 : "Waiting" },
    { process5 : "Waiting" },
    { process6 : "Waiting" }
]

var worker1 = null;
var worker2 = null;
var worker3 = null;
var worker4 = null;
var worker5 = null;
var worker6 = null;
var device = null;
var nProcessID = 1;

var hashStuff = {
    fileName: "",
    mode: "",
    filePointer: 0,
    position: 0,
    content: ""
}

function onMessageProcess(event) {
    var task = event.data;
    task.ProcessID = nProcessID;
    
    nProcessID += 1;
    
    console.log(""+event.data);
    console.log(nProcessID);
    
    device.postMessage(task);
}

function onMessageDevice(event) {
    var task = event.data;    
    console.log("Something here");
    if(task.sysCall === "Read File"){
        worker2.postMessage(task);
    }
    //Put all workers into an array
    //Call worker at index something
}

function testingInputOutput() {
    "use strict";
    var os = new OperatingSystem();
    console.log("Something here 1");
    if (worker1) {
        console.log("Something here 2");
        return;
    }
    
    device = new Worker("IODeviceDriver.js");
    device.onmessage = onMessageDevice;
    
    console.log("Something here 3");
    //worker1 = new Worker("ContactManager.js");
    //worker1.onmessage = onMessageProcess;
    
    worker2 = new Worker("BankProcess.js");
    //worker2.onmessage = onMessageProcess;
    
    while(statesQueue)
    
    if(statesQueue[1].process2 === "Waiting") {
        console.log("This if statement");
        firstToStopWaiting = 1;
        os.open("Bank.CSV", "Read");      
    }
    
    if(statesQueue[1].process2 === "Waiting"){
        console.log("That if statement");
        statesQueue[2].process2 = "Running";
        os.read("Bank.CSV", 0);
    }
    
    
//    worker3 = new Worker("passwordchanger.js");
//    //worker3.onmessage = onMessageProcess;
//    
//    worker4 = new Worker("ReadFile.js");
//    //worker4.onmessage = onMessageProcess;
//    
//    worker5 = new Worker("StatisticsCalculate.js");
//    //worker5.onmessage = onMessageProcess;
//    
//    worker6 = new Worker("VectorCalculate.js");
    //worker6.onmessage = onMessageProcess;
    
//    while(IOStop !== 0) {
//        for(int i = 0; i<statesQueue.length; i++){
//            if("Running" in statesQueue[i]) {
//                
//            }
//            if("Ready" in statesQueue[i]) {
//                
//            }
//            if("Waiting" in statesQueue[i]) {
//                firstToStopWaiting = 1;
//                
//            }
//        }
//    }
}

/************************************************
*   stopInputOutput()
*   stops all workers
*************************************************/
function stopInputOutput() {
    if (!worker1) { return; }
    worker1.terminate();
    worker1 = undefined;
    
    worker2.terminate();
    worker2 = undefined;
    
    worker3.terminate();
    worker3 = undefined;
    
    worker4.terminate();
    worker4 = undefined;
    
    worker5.terminate();
    worker5 = undefined;
    
    worker6.terminate();
    worker6 = undefined;
    
    device.terminate();
    device = undefined;
}

function OperatingSystem() {
    "use strict";

    this.message = null;
    
    //Mode: read or write
    //Flags
    //return error code or nothing
    this.open = function (fileName, mode) {
        var task = { 
            sysCall : "Open File", 
            fileName : fileName,
            mode : mode,
        };
        device.postMessage(task);	
        if (fileName in hashDirectory) {
            return 1;
        } else {
            return -1;
        }
    };
    
    //Flags, returns an error code
    this.close = function (fileName, filePointer) {
        var task = { 
            sysCall : "Close File", 
            filePointer : filePointer,
        };
        device.postMessage(task);
        if (fileName in arrOpenFiles) {
            return 1;
        } else {
            return -1;
        }
    };
    
    this.create = function (fileName, contents, mode) {
        //hashDirectory[fileName] = contents.match(/.{1,100}/g);
        var task = { 
            sysCall : "Create File", 
            name : fileName,
            mode : mode,
        };
        device.postMessage(task);	
        return 1;
    };
    //returns an error code
    this.delet = function (fileName) {
        var task = { 
            sysCall : "Delete File", 
            name : fileName,
        };
        device.postMessage(task);
        if (fileName in hashDirectory) {
            delete hashDirectory[fileName];
            return 1;
        } else {
            return -1;
        }
    };
    
    //return num of Bytes / length of string
    this.read = function (fileName, position) {
        var task = { 
            sysCall : "Read File", 
            fileName: fileName,
            filePointer : position,
            length : hashDirectory[fileName].length,
        };
        device.postMessage(task);
        return hashDirectory[fileName].length;
    };
    
    //return num of bytes / length of string
    this.write = function (fileName, filePointer, contents) {
        var task = { 
            sysCall : "Write File", 
            filePointer : filePointer,
            data : contents,
        };
        device.postMessage(task);
        hashDirectory[fileName] = contents.match(/.{1,100}/g);
        return contents.length;
    };
    
    this.length = function (fileName, filePointer) {
        var task = { 
            sysCall : "Length of File", 
            filePointer : filePointer,  
        };
        device.postMessage(task);
        return hashDirectory[fileName].length;
    };
    
    this.seek = function (fileName, position, filePointer) {
        var task = { 
            sysCall : "Seek Position", 
            filePointer : filePointer,
            position : position,
        };
        device.postMessage(task);
        return hashDirectory[fileName][position];
    };
    
    this.position = function (filePointer) {
        var task = { 
            sysCall : "Position of File", 
            filePointer : fp,  
        };
        device.postMessage(task);
        
    };
    
    this.endOfFile = function (filePointer) {
        //Do if statement, if pointer is at the end of array
        var task = { 
            sysCall : "End of File", 
            filePointer : filePointer,
        };
        device.postMessage(task);
    } 
}

this.addEventListener('message', onMessageDevice, false);