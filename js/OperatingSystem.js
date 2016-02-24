var os = new OperatingSystem();

var hashProcessStates = {
    Ready : "Ready",
    Waiting : "Waiting",
    Running : "Running",
    Starting : "Starting",
    Stopping : "Stopping"
};

var bankResult = 0;

var statesQueue = [
//    { process1 : "Starting" },
    { process2 : "Starting" },
//    { process3 : "Waiting" },
//    { process4 : "Waiting" },
//    { process5 : "Waiting" },
//    { process6 : "Waiting" }
]

var EOF = false;

var arrWorker = [
    new Worker("ContactManager.js"),
    new Worker("BankProcess.js"),
    new Worker("passwordchanger.js"),
    new Worker("ReadFile.js"),
    new Worker("StatisticsCalculate.js"),
    new Worker("VectorCalculate.js")
];

var device = null;

var nProcessID = 1;

var hashStuff = {
    fileName: "",
    mode: "",
    filePointer: 0,
    position: 0,
    content: ""
}

function onMessageDevice(event) {
    var task = event.data;    
    console.log("Something here");
    if(task.sysCall === "Open File"){
        whileLoop();
    }
    if(task.sysCall === "Read File"){
        arrWorker[1].postMessage(task);
    }
    if(task.sysCall==="Close File"){
       console.log(task.filePointer);
    }
    if(task.sysCall === "End of File"){
        console.log("This is end of file, gg");
        EOF = task.checkEOF;
    }
}

function testingInputOutput() {
    "use strict";
    console.log("Something here 1");
//    if (arrWorker[0]) {
//        console.log("Something here 2");
//        return;
//    }
    
    device = new Worker("IODeviceDriver.js");
    device.onmessage = onMessageDevice;
    
    console.log("Something here 3");
    
    whileLoop();
}
arrWorker[1].onmessage = function(e) {
    console.log(e.data);
    bankResult = e.data;
    var check = os.endOfFile(1, "Bank.CSV");
    console.log(check);
    //whileLoop();
}

function whileLoop(){
    while (statesQueue.length != 0)
    {
        if (statesQueue[0].process2 === "Starting")
        {
           console.log("Process 2 is Starting");
           statesQueue[0].process2 = "Waiting";
        }
        else if (statesQueue[0].process2 === "Waiting") 
        {
            console.log("Process 2 is waiting");
            statesQueue[0].process2 = "Ready";
            os.open("Bank.CSV", "Read");
            break;
        }
        else if (statesQueue[0].process2 === "Ready")
        {
            console.log("Process 2 is ready");
            statesQueue[0].process2 = "Running";
        }
        else if (statesQueue[0].process2 === "Running")
        {
            console.log("Process 2 is running");
            if(arrOpenFiles[1].szMode === "Read")
            {
                os.read("Bank.CSV", 1)
            }else if (aarrOpenFiles[].szMode === "Write"){
                os.write("Result.CSV", -1, bankResult);
            }
            
            os.endOfFile(1, "Bank.CSV");
            if(EOF){
                statesQueue[0].process2 = "Stopping";
            }else{
                statesQueue[0].process2 = "Waiting"
            }break;
        }
        else if (statesQueue[0].process2 === "Stopping")
        {
            console.log("Process 2 has stopped");
            statesQueue.splice(0,1);
        }   
    }
}

/************************************************
*   stopInputOutput()
*   stops all workers
*************************************************/
function stopInputOutput() {
    if (!worker[0]) { return; }
    
    for (var i = 0; i<arrWorker.length; i++){
        arrWorker[i].terminate();
        arrWorker[i] = undefined;
    }
    
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
        setTimeout(open(fileName, mode), 5200);
    };
    
    //Flags, returns an error code
    this.close = function (fileName, filePointer) {
        var task = { 
            sysCall : "Close File", 
            filePointer : filePointer,
        };
        device.postMessage(task);
    };
    
    this.create = function (fileName, mode) {
        var task = { 
            sysCall : "Create File", 
            name : fileName,
            mode : mode,
        };
        device.postMessage(task);	
        return 1;
    };

    this.delet = function (fileName) {
        var task = { 
            sysCall : "Delete File", 
            name : fileName,
        };
        device.postMessage(task);
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
        //setTimeout(read (fileName, position), 5200);
    };
    
    //return num of bytes / length of string
    this.write = function (fileName, filePointer, contents) {
        var task = { 
            sysCall : "Write File",
            fileName: fileName,
            filePointer : filePointer,
            data : contents,
        };
        device.postMessage(task);
    };
    
    this.length = function (fileName, filePointer) {
        var task = { 
            sysCall : "Length of File", 
            filePointer : filePointer,  
        };
        device.postMessage(task);
    };
    
    this.seek = function (fileName, position, filePointer) {
        var task = { 
            sysCall : "Seek Position", 
            filePointer : filePointer,
            position : position,
        };
        device.postMessage(task);
    };
    
    this.position = function (filePointer) {
        var task = { 
            sysCall : "Position of File", 
            filePointer : fp,  
        };
        device.postMessage(task);
        
    };
    
    this.endOfFile = function (filePointer, fileName) {
        var task = {
            sysCall: "End of File",
            filePointer: filePointer,
            fileName: fileName,
            checkEOF: false
        }
        device.postMessage(task);
    } 
}

this.addEventListener('message', onMessageDevice, false);