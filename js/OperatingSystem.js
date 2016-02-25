var os = new OperatingSystem();

var resultString = {
    contactResult: "",
    bankResult: 0,
    passwordResult: "",
    readResult: "",
    statsResult: "",
    vectorResult: ""
}

var resultFiles = [
    "Result1.CSV",
    "Result2.CSV",
    "Result3.CSV",
    "Result4.CSV",
    "Result5.CSV",
    "Result6.CSV",
];

var arrDirectory = [
    "Contact.CSV",
    "Bank.CSV",
    "password.CSV",
    "read.CSV",
    "stats.CSV",
    "vector.CSV"
]

var bankResult = 0;

var read = "";

var programCounter = 0;
var processNumberI = 0;

var statesQueue = [
//    { process : "Starting" },
    { process : "Starting" },
//    { process : "Waiting" },
//    { process : "Waiting" },
//    { process : "Waiting" },
//    { process : "Waiting" }
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
        read = task.Mode;
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
    os.endOfFile(1, "Bank.CSV");
    console.log(EOF);
    if (EOF){
        console.log("I got here");
        os.create("Result.CSV", "Write");
        os.write("Result.CSV", 1, bankResult);
    }
    //console.log(check);
    whileLoop();
}

function whileLoop(){
    while (statesQueue.length != 0)
    {
        //If statement checking from top to bottom 
        //which one is in Running
        if (statesQueue[processNumberI].process === "Starting")
        {
           console.log("Process 2 is Starting");
            os.open("Bank.CSV", "Read");
           statesQueue[0].process = "Waiting";
        }
        else if (statesQueue[processNumberI].process === "Waiting") 
        {
            console.log("Process 2 is waiting");
            statesQueue[processNumberI].process = "Ready";
            
//            if(read === "Read")
//            {
//                os.read("Bank.CSV", 1)
//            }            
            break;
        }
        else if (statesQueue[processNumberI].process === "Ready")
        {
            console.log("Process 2 is ready");
            statesQueue[processNumberI].process = "Running";
        }
        else if (statesQueue[processNumberI].process === "Running")
        {
            console.log("Process 2 is running");
            if(read === "Read")
            {
                os.read("Bank.CSV", 1)
            }
            os.endOfFile(1, "Bank.CSV");
            if(EOF)
            {
                //os.create("Result.CSV", "Write");
                //os.write("Result.CSV", -1, bankResult);
                statesQueue[processNumberI].process = "Stopping";
            }else
            {
                statesQueue[processNumberI].process = "Waiting";
            }
            console.log(statesQueue[0].process);
        }
        if (statesQueue[processNumberI].process === "Stopping")
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
            Mode : mode,
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
            //length : hashDirectory[fileName].length,
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