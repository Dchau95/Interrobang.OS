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
            nProcessID: processNumberI,
            sysCall : "Open File",
            fileName : fileName,
            Mode : mode
        };
        //commandOutput("Opening File\n");
        console.log("In open");
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be closed
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.close = function (fileName, filePointer) {
        var task = {
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
            nProcessID: processNumberI,
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
    { process: "Dummy", processID: 0, EOF: false, result: ""},
//    { process : "Starting", processID: 1, EOF: false, result: ""},
//    { process : "Starting", processID: 2, EOF: false, result: 0},
//    { process : "Starting", processID: 3, EOF: false, result: ""},
//    { process : "Starting", processID: 4, EOF: false, result: ""},
//    { process : "Starting", processID: 5, EOF: false, result: ""},
//    { process : "Starting", processID: 6, EOF: false, result: ""}
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
            console.log("Process " + statesQueue[processNumberI].processID + " is Starting");
            os.open(arrDirectory[processNumberI], "Read");
            statesQueue[processNumberI].process = "Waiting";
        } else if (statesQueue[processNumberI].process === "Waiting") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Waiting\n");
            console.log("Process " + statesQueue[processNumberI].processID + " is waiting");
            statesQueue[processNumberI].process = "Ready";
            break;
        } else if (statesQueue[processNumberI].process === "Ready") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Ready\n");
            console.log("Process " + statesQueue[processNumberI].processID + " is ready");
            statesQueue[processNumberI].process = "Running";
        } else if (statesQueue[processNumberI].process === "Running") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Running\n");
            console.log("Process " + statesQueue[processNumberI].processID + " is running");
            if (statesQueue[processNumberI].EOF) {
                statesQueue[processNumberI].process = "Stopping";
            } else {
                os.read(arrDirectory[processNumberI], processNumberI);
                statesQueue[processNumberI].process = "Waiting";
            }
            console.log("Process " + statesQueue[processNumberI].processID + statesQueue[processNumberI].process);
        } else if (statesQueue[processNumberI].process === "Stopping") {
            commandOutput("Process "+statesQueue[processNumberI].processID+" is Stopping\n");
            console.log("Process " + statesQueue[processNumberI].processID + " has stopped");
            statesQueue[processNumberI].process = "Stopped";
            nStatesLength-=1;
        } else if (statesQueue[processNumberI].process === "Stopped") {
            continue;
        }
    }
}

//Function that gets the response from the IODevice
function onMessageDevice(event) {
    var task = event.data;
    console.log("Response from IO");
    if (task.sysCall === "Open File") {
        console.log("Syscall Open: We go to while loop");
        whileLoop();
    }
    else if (task.sysCall === "Read File") {
        console.log("Syscall Read: We call the worker "+task.nProcessID);
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
        console.log("Syscall End of File, we change EOF");
        console.log(processNumberI);
        console.log(statesQueue[processNumberI]);
        statesQueue[task.nProcessID].EOF = task.checkEOF;
        console.log(task);
    }
}

//Main function
function testingInputOutput() {
    "use strict";    
//    arrWorker[1].onmessage = onMessageProcess1;
//    arrWorker[2].onmessage = onMessageProcess2;
//    arrWorker[3].onmessage = onMessageProcess1;
//    arrWorker[4].onmessage = onMessageProcess2;
//    arrWorker[5].onmessage = onMessageProcess1;
//    arrWorker[6].onmessage = onMessageProcess1;
//        
    //commandOutput("OS is starting\n");
    console.log("In testingInputOutput");
    
    whileLoop();
}

function runContact() {
    commandOutput("Contact Manager is starting\n");
    arrWorker[1].onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 1, EOF: false, result: ""});
    nStatesLength+=1;
    testingInputOutput();
}

function runBank() {
    commandOutput("Bank Process is starting\n");
    arrWorker[2].onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 2, EOF: false, result: 0});
    nStatesLength+=1;
    testingInputOutput();
}

function runPassword() {
    commandOutput("Password Process is starting\n");
    arrWorker[3].onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 3, EOF: false, result: ""});
    nStatesLength+=1;
    testingInputOutput();
}

function runRead() {
    commandOutput("Read Process is starting\n");
    arrWorker[4].onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processID: 4, EOF: false, result: ""});
    nStatesLength+=1;
    testingInputOutput();
}

function runVector() {
    commandOutput("Vector Calculate is starting\n");
    arrWorker[5].onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processID: 5, EOF: false, result: ""});
    nStatesLength+=1;
    testingInputOutput();
}

function runStats() {
    commandOutput("Stats Process is starting\n");
    arrWorker[6].onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processID: 6, EOF: false, result: ""});
    nStatesLength+=1;
    testingInputOutput();
}


function onMessageProcess1 (e) {
    commandOutput("Process "+e.data.processNumberI+" has responded with data\n");
    if(e.data.result !== "undefined"){
        statesQueue[e.data.processNumberI].result = e.data.result;
    }
    console.log("Result of worker "+e.data.processNumberI+" "+statesQueue[e.data.processNumberI].result);
    os.endOfFile(e.data.processNumberI, arrDirectory[e.data.processNumberI]);
    console.log(statesQueue[e.data.processNumberI].EOF);
    if(e.data.result === "undefined"){
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF ||  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        console.log("This is the end of the file for process "+e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        os.create(resultFiles[e.data.processNumberI], "Write");
        os.write(resultFiles[e.data.processNumberI], e.data.processNumberI, statesQueue[e.data.processNumberI].result);
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
    console.log("Result of worker "+e.data.processNumberI+" "+statesQueue[e.data.processNumberI].result);
    os.endOfFile(e.data.processNumberI, arrDirectory[e.data.processNumberI]);
    console.log(statesQueue[e.data.processNumberI].EOF);
    if(e.data.result === "undefined"){
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
    } else if (statesQueue[e.data.processNumberI].EOF &&  e.data.result !== "undefined") {
        commandOutput("This is the end of the file for process "+e.data.processNumberI+"\n");
        console.log("This is the end of the file for process "+e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        os.close(arrDirectory[e.data.processNumberI], e.data.processNumberI);
        os.create(resultFiles[e.data.processNumberI], "Write");
        os.write(resultFiles[e.data.processNumberI], e.data.processNumberI, statesQueue[e.data.processNumberI].result);
    }
    whileLoop();
}
/************************************************
*   stopInputOutput()
*   stops all workers
*************************************************/
//function stopInputOutput() {
//    if (!arrWorker[0]) { return; }
//    
//    for (var i = 0; i<arrWorker.length; i++){
//        arrWorker[i].terminate();
//        arrWorker[i] = undefined;
//    }
//    
//    device.terminate();
//    device = undefined;
//}

self.addEventListener('message', onMessageDevice, false);