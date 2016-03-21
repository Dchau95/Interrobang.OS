//The IO device driver
var device = new Worker('IODeviceDriver.js');
device.onmessage = onMessageDevice;
device.onerror = function (event){
    console.log("Why you error");
    console.log(event);
};

//The Operating System class
function OperatingSystem() {
    "use strict";

    /*
     * @param fileName: Name of the file to be opened
              mode: Either read or write
     */
    this.open = function (fileName, mode) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Open File",
            fileName : fileName,
            Mode : mode
        };
        commandOutput("Opening File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be closed
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.close = function (fileName, filePointer) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            fileName : fileName,
            sysCall : "Close File",
            filePointer : filePointer
        };
        commandOutput("Closing File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: The name of the file to be created
              mode: Either read or write
     */
    this.create = function (fileName, mode) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Create File",
            fileName : fileName,
            mode : mode
        };
        commandOutput("Creating File\n");
        device.postMessage(task);
    };

    /*
     * @param fileName: Name of the file to be deleted
     */
    this.delet = function (fileName) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Delete File",
            fileName : fileName
        };
        commandOutput("Deleting File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.read = function (fileName, filePointer) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Read File",
            fileName: fileName,
            filePointer : filePointer
        };
        commandOutput("Reading File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be write
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
              contents: Data retreived from the process to be written
     */
    this.write = function (fileName, filePointer, contents) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Write File",
            fileName: fileName,
            filePointer : filePointer,
            data : contents
        };
        commandOutput("Writing File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to get the length
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.length = function (fileName, filePointer) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Length of File",
            filePointer : filePointer
        };
        commandOutput("Length of File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
              position: position of the pointer/index of the contents array in arrOpenFiles
     */
    this.seek = function (fileName, position, filePointer) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Seek Position",
            filePointer : filePointer,
            position : position
        };
        commandOutput("Seeking position of File\n");
        device.postMessage(task);
    };
    
    /*
     * @param filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.position = function (filePointer, fileName) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall : "Position of File",
            fileName: fileName,
            filePointer : filePointer
        };
        commandOutput("Position of File\n");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.endOfFile = function (filePointer, fileName) {
        var task = {
            nProcessID: statesQueue[processNumberI].processID,
            sysCall: "End of File",
            filePointer: filePointer,
            fileName: fileName,
            checkEOF: false,
        };
        commandOutput("End of File\n");
        device.postMessage(task);
    };
}

//Create a global os
var os = new OperatingSystem();

//Counter for which processes to go
var processNumberI = 0;

//Queue/array for the states of the processes
var statesQueue = [
    { process: "Dummy", processID: 0, EOF: false, result: "", resultCsv: "", fileName: ""},
];

//Array of workers
var arrWorker = [
    dummyWorker = new Worker("main.js"),
    contact = new Worker("ContactManager.js"),
    bank = new Worker("BankProcess.js"),
    password = new Worker("passwordchanger.js"),
    read = new Worker("ReadFile.js"),
    vector = new Worker("VectorCalculate.js"),
    stats = new Worker("StatisticsCalculate.js")
];

var nStatesLength = statesQueue.length;

//Function that operates as the loop for the entire OS until there are no more processes left.
function whileLoop() {
    while (nStatesLength !== 1) {
        if (processNumberI >= statesQueue.length - 1) {
            processNumberI = 0;
        }
        processNumberI += 1;
        console.log("Right fucking here " + processNumberI);
        //If statement checking from top to bottom 
        //which one is in Running
        if (statesQueue[processNumberI].process === "Starting") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Starting\n");
            os.open(arrDirectory[processNumberI], "Read");
            statesQueue[processNumberI].process = "Waiting";
        } else if (statesQueue[processNumberI].process === "Waiting") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Waiting\n");
            statesQueue[processNumberI].process = "Ready";
            break;
        } else if (statesQueue[processNumberI].process === "Ready") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Ready\n");
            statesQueue[processNumberI].process = "Running";
        } else if (statesQueue[processNumberI].process === "Running") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Running\n");
            if (statesQueue[processNumberI].EOF) {
                statesQueue[processNumberI].process = "Stopping";
            } else {
                os.read(arrDirectory[processNumberI], processNumberI);
                statesQueue[processNumberI].process = "Waiting";
            }
        } else if (statesQueue[processNumberI].process === "Stopping") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Stopping\n");
            statesQueue[processNumberI].process = "Stopped";
            nStatesLength-=1;
        } else if (statesQueue[processNumberI].process === "Stopped") {
            statesQueue.splice(processNumberI,1);
            continue;
        }
    }
}

//Function that gets the response from the IODevice
function onMessageDevice(event) {
    var task = event.data;
    if (task.sysCall === "Open File") {
        whileLoop();
    }
    else if (task.sysCall === "Read File") {
        if( arrWorker[task.nProcessID] === 'undefined'){
            arrWorker[task.nProcessID-1].postMessage(task);
        }else{
            arrWorker[task.nProcessID].postMessage(task);
        }
    }
    else if (task.sysCall === "Close File") {
        console.log("We closed the damn file");
    }
    else if (task.sysCall === "End of File") {
        statesQueue[task.nProcessID].EOF = task.checkEOF;
    }
}

function runContact() {
    commandOutput("Contact Manager is starting\n");
    arrWorker[1].onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 1, EOF: false, result: "", resultCsv: "Result1.CSV"});
    nStatesLength+=1;
    whileLoop();
}

function runBank() {
    commandOutput("Bank Process is starting\n");
    arrWorker[2].onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 2, EOF: false, result: 0, resultCsv: "Result2.CSV"});
    nStatesLength+=1;
    whileLoop();
}

function runPassword() {
    commandOutput("Password Process is starting\n");
    arrWorker[3].onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 3, EOF: false, result: "", resultCsv: "Result3.CSV"});
    nStatesLength+=1;
    whileLoop();
}

function runRead() {
    commandOutput("Read Process is starting\n");
    arrWorker[4].onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 4, EOF: false, result: "", resultCsv: "Result4.CSV"});
    nStatesLength+=1;
    whileLoop();
}

function runVector() {
    commandOutput("Vector Calculate is starting\n");
    arrWorker[5].onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 5, EOF: false, result: "", resultCsv: "Result5.CSV"});
    nStatesLength+=1;
    whileLoop();
}

function runStats() {
    commandOutput("Stats Process is starting\n");
    arrWorker[6].onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 6, EOF: false, result: "", resultCsv: "Result6.CSV"});
    nStatesLength+=1;
    whileLoop();
}


function onMessageProcess1 (e) {
    commandOutput("Process "+e.data.processNumberI+" has responded with data\n");
    if(e.data.result !== "undefined"){
        statesQueue[e.data.processNumberI].result = e.data.result;
    }
    os.endOfFile(e.data.processNumberI, arrDirectory[e.data.processNumberI]);
    if(e.data.result === "undefined"){
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF ||  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write");
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result);
        commandOutput(statesQueue[e.data.processNumberI].result);
        commandOutput("\n");
    }
    whileLoop();
}

function osCMD(userInput)
{
    runCMD(userInput);
}

//For arrWorker[2] and arrWorker[4]
function onMessageProcess2 (e) {
    commandOutput("Process "+e.data.processNumberI+" has responded with data\n");
    if(e.data.result !== "undefined")
        statesQueue[e.data.processNumberI].result += e.data.result;
    os.endOfFile(e.data.processNumberI, arrDirectory[e.data.processNumberI]);
    if(e.data.result === "undefined"){
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF &&  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write");
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result);
        commandOutput(statesQueue[e.data.processNumberI].result);
        commandOutput("\n");
    }
    whileLoop();
}

self.addEventListener('message', onMessageDevice, false);