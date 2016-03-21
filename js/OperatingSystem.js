//The IO device driver
var device = new Worker('IODeviceDriver.js');
device.onmessage = onMessageDevice;

//The Operating System class
function OperatingSystem() {
    "use strict";

    /*
     * @param fileName: Name of the file to be opened
              mode: Either read or write
     */
    this.open = function (fileName, mode, processID) {
        var task = {
            nProcessID: processID,
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
            nProcessID: filePointer,
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
    this.create = function (fileName, mode, processID) {
        var task = {
            nProcessID: processID,
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
    this.delet = function (fileName, processID) {
        var task = {
            nProcessID: processID,
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
            nProcessID: filePointer,
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
    this.write = function (fileName, filePointer, contents, processID) {
        var task = {
            nProcessID: processID,
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
    this.length = function (fileName, filePointer, processID) {
        var task = {
            nProcessID: processID,
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
    this.seek = function (fileName, position, filePointer, processID) {
        var task = {
            nProcessID: processID,
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
    this.position = function (filePointer, fileName, processID) {
        var task = {
            nProcessID: processID,
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
            nProcessID: filePointer,
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
    { process: "Dummy", processID: 0, EOF: false, result: "", resultCsv: "", fileCsv: ""},
];

//Array of workers
var arrWorker = [
    dummyWorker = new Worker("main.js"),
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
            os.open(statesQueue[processNumberI].fileCsv, "Read", processNumberI);
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
                os.read(statesQueue[processNumberI].fileCsv, processNumberI);
                statesQueue[processNumberI].process = "Waiting";
            }
        } else if (statesQueue[processNumberI].process === "Stopping") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Stopping\n");
            statesQueue[processNumberI].process = "Stopped";
        } else if (statesQueue[processNumberI].process === "Stopped") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" has Stopped\n");
            nStatesLength-=1;
            statesQueue.splice(processNumberI,1);
            arrWorker.splice(processNumberI,1);
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
    var contact = new Worker("ContactManager.js");
    contact.onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 1, EOF: false, result: "", resultCsv: "Result1.CSV", fileCsv: "Contact.CSV"});
    arrWorker.push(contact);
    nStatesLength+=1;
    whileLoop();
}

function runBank() {
    commandOutput("Bank Process is starting\n");
    var bank = new Worker("BankProcess.js");
    bank.onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 2, EOF: false, result: 0, resultCsv: "Result2.CSV", fileCsv: "Bank.CSV"});
    arrWorker.push(bank);
    nStatesLength+=1;
    whileLoop();
}

function runPassword() {
    commandOutput("Password Process is starting\n");
    var password = new Worker("passwordchanger.js");
    password.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 3, EOF: false, result: "", resultCsv: "Result3.CSV", fileCsv: "password.CSV"});
    arrWorker.push(password);
    nStatesLength+=1;
    whileLoop();
}

function runRead() {
    commandOutput("Read Process is starting\n");
    var read = new Worker("ReadFile.js");
    read.onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 4, EOF: false, result: "", resultCsv: "Result4.CSV", fileCsv: "read.CSV"});
    arrWorker.push(read);
    nStatesLength+=1;
    whileLoop();
}

function runVector() {
    commandOutput("Vector Calculate is starting\n");
    var vector = new Worker("VectorCalculate.js");
    vector.onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 5, EOF: false, result: "", resultCsv: "Result5.CSV", fileCsv: "vector.CSV"});
    arrWorker.push(vector);
    nStatesLength+=1;
    whileLoop();
}

function runStats() {
    commandOutput("Stats Process is starting\n");
    var stats = new Worker("StatisticsCalculate.js")
    stats.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 6, EOF: false, result: "", resultCsv: "Result6.CSV", fileCsv: "stats.CSV"});
    arrWorker.push(stats);
    nStatesLength+=1;
    whileLoop();
}


function onMessageProcess1 (e) {
    commandOutput("Process "+e.data.processNumberI+" has responded with data\n");
    if(e.data.result !== "undefined"){
        statesQueue[e.data.processNumberI].result = e.data.result;
    }
    os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    if(e.data.result === "undefined"){
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF ||  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
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
    os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    if(e.data.result === "undefined"){
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF &&  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result);
        commandOutput(statesQueue[e.data.processNumberI].result);
        commandOutput("\n");
    }
    whileLoop();
}

self.addEventListener('message', onMessageDevice, false);