//The IO device driver
var device = null;

//The Operating System class
function OperatingSystem() {
    "use strict";

    /*
     * @param fileName: Name of the file to be opened
              mode: Either read or write
     */
    this.open = function (fileName, mode) {
        var task = {
            sysCall : "Open File",
            fileName : fileName,
            Mode : mode
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be closed
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.close = function (fileName, filePointer) {
        var task = {
            sysCall : "Close File",
            filePointer : filePointer
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: The name of the file to be created
              mode: Either read or write
     */
    this.create = function (fileName, mode) {
        var task = {
            sysCall : "Create File",
            name : fileName,
            mode : mode
        };
        device.postMessage(task);
    };

    /*
     * @param fileName: Name of the file to be deleted
     */
    this.delet = function (fileName) {
        var task = {
            sysCall : "Delete File",
            name : fileName
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.read = function (fileName, filePointer) {
        var task = {
            sysCall : "Read File",
            fileName: fileName,
            filePointer : filePointer
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be write
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
              contents: Data retreived from the process to be written
     */
    this.write = function (fileName, filePointer, contents) {
        var task = {
            sysCall : "Write File",
            fileName: fileName,
            filePointer : filePointer,
            data : contents
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to get the length
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.length = function (fileName, filePointer) {
        var task = {
            sysCall : "Length of File",
            filePointer : filePointer
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
              position: position of the pointer/index of the contents array in arrOpenFiles
     */
    this.seek = function (fileName, position, filePointer) {
        var task = {
            sysCall : "Seek Position",
            filePointer : filePointer,
            position : position
        };
        device.postMessage(task);
    };
    
    /*
     * @param filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.position = function (filePointer) {
        var task = {
            sysCall : "Position of File",
            filePointer : filePointer
        };
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be read
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.endOfFile = function (filePointer, fileName) {
        var task = {
            sysCall: "End of File",
            filePointer: filePointer,
            fileName: fileName,
            checkEOF: false,
        };
        device.postMessage(task);
    };
}

//Create a global os
var os = new OperatingSystem();

//Array of results from the processes
var resultString = [
    "dummy",
    "",
    0,
//    "",
//    "",
//    "",
//    ""
];

//Array of files to put the result into
var resultFiles = [
    "ResultDummy",
    "Result1.CSV",
    "Result2.CSV",
//    "Result3.CSV",
//    "Result4.CSV",
//    "Result5.CSV",
//    "Result6.CSV",
];

//Array of files for the processes to open
var arrDirectory = [
    "Dummy.CSV",
    "Contact.CSV",
    "Bank.CSV",
//    "password.CSV",
//    "read.CSV",
//    "stats.CSV",
//    "vector.CSV"
];

//Counter for which processes to go
var processNumberI = 0;

//Queue/array for the states of the processes
var statesQueue = [
    { process: "Dummy", processID: 0},
    { process : "Starting", processID: 1},
    { process : "Starting", processID: 2},
//    { process : "Waiting", processID: 3},
//    { process : "Waiting", processID: 4},
//    { process : "Waiting", processID: 5 },
//    { process : "Waiting", processID: 6 }
];

//Global variable to know when a file is at the end 
var EOF = false;

//Array of workers
var arrWorker = [
    new Worker("main.js"),
    new Worker("ContactManager.js"),
    new Worker("BankProcess.js"),
    new Worker("passwordchanger.js"),
    new Worker("ReadFile.js"),
    new Worker("StatisticsCalculate.js"),
    new Worker("VectorCalculate.js")
];

//Function that operates as the loop for the entire OS until there are no more processes left.
function whileLoop() {
    while (statesQueue.length !== 1) {
        if (processNumberI >= statesQueue.length - 1) {
            processNumberI = 0;
        }
        processNumberI += 1;
        console.log("Right fucking here " + processNumberI);
        //If statement checking from top to bottom 
        //which one is in Running
        if (statesQueue[processNumberI].process === "Starting") {
            console.log("Process " + statesQueue[processNumberI].processID + " is Starting");
            os.open(arrDirectory[processNumberI], "Read");
            statesQueue[processNumberI].process = "Waiting";
        } else if (statesQueue[processNumberI].process === "Waiting") {
            console.log("Process " + statesQueue[processNumberI].processID + " is waiting");
            statesQueue[processNumberI].process = "Ready";
            
//            if(read === "Read")
//            {
//                os.read("Bank.CSV", 1)
//            }            
            break;
        } else if (statesQueue[processNumberI].process === "Ready") {
            console.log("Process " + statesQueue[processNumberI].processID + " is ready");
            statesQueue[processNumberI].process = "Running";
        } else if (statesQueue[processNumberI].process === "Running") {
            console.log("Process " + statesQueue[processNumberI].processID + " is running");
            os.endOfFile(processNumberI, arrDirectory[processNumberI]);
            if (EOF) {
                //os.create("Result.CSV", "Write");
                //os.write("Result.CSV", -1, bankResult);
                statesQueue[processNumberI].process = "Stopping";
                EOF = false;
            } else {
                os.read(arrDirectory[processNumberI], processNumberI);
                statesQueue[processNumberI].process = "Waiting";
            }
            console.log("Process " + statesQueue[processNumberI].processID + statesQueue[processNumberI].process);
        }
        if (statesQueue[processNumberI].process === "Stopping") {
            console.log("Process " + statesQueue[processNumberI].processID + " has stopped");
            statesQueue.splice(processNumberI, 1);
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
    if (task.sysCall === "Read File") {
        console.log("Syscall Read: We call the worker");
        arrWorker[processNumberI].postMessage(task);
    }
    if (task.sysCall === "Close File") {
        console.log(task.filePointer);
    }
    if (task.sysCall === "End of File") {
        console.log("Syscall End of File, we change EOF");
        EOF = task.checkEOF;
        console.log(task);
        //whileLoop();
    }
}

//Main function
function testingInputOutput() {
    "use strict";
//    if (arrWorker[0]) {
//        console.log("Something here 2");
//        return;
//    }
    
    device = new Worker("IODeviceDriver.js");
    device.onmessage = onMessageDevice;
    
    whileLoop();
}

//arrWorker[1...6] are functions that get the response from their respective processes
arrWorker[1].onmessage = function (e) {
    console.log(e.data);
    resultString[processNumberI] += e.data;
    os.endOfFile(1, arrDirectory[processNumberI]);
    console.log(EOF);
    if (EOF && e.data) {
        console.log("This is the end of the file for process 1");
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
};

arrWorker[2].onmessage = function (e) {
    console.log(e.data);
    resultString[processNumberI] = e.data;
    os.endOfFile(1, arrDirectory[processNumberI]);
    console.log(EOF);
    if (EOF) {
        console.log("This is the end of the file for process 2");
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
};

//arrWorker[3].onmessage = function(e) {
//    console.log(e.data);
//    resultString[processNumberI] = e.data;
//    os.endOfFile(1, arrDirectory[processNumberI]);
//    console.log(EOF);
//    if (EOF){
//        console.log("I got here");
//        os.create(resultFiles[processNumberI], "Write");
//        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
//    }
//    whileLoop();
//}
//
//arrWorker[4].onmessage = function(e) {
//    console.log(e.data);
//    resultString[processNumberI] = e.data;
//    os.endOfFile(1, arrDirectory[processNumberI]);
//    console.log(EOF);
//    if (EOF){
//        console.log("I got here");
//        os.create(resultFiles[processNumberI], "Write");
//        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
//    }
//    whileLoop();
//}
//
//arrWorker[5].onmessage = function(e) {
//    console.log(e.data);
//    resultString[processNumberI] = e.data;
//    os.endOfFile(1, arrDirectory[processNumberI]);
//    console.log(EOF);
//    if (EOF){
//        console.log("I got here");
//        os.create(resultFiles[processNumberI], "Write");
//        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
//    }
//    whileLoop();
//}
//
//arrWorker[6].onmessage = function(e) {
//    console.log(e.data);
//    resultString[processNumberI] = e.data;
//    os.endOfFile(1, arrDirectory[processNumberI]);
//    console.log(EOF);
//    if (EOF){
//        console.log("I got here");
//        os.create(resultFiles[processNumberI], "Write");
//        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
//    }
//    whileLoop();
//}

/************************************************
*   stopInputOutput()
*   stops all workers
*************************************************/
function stopInputOutput() {
    if (!arrWorker[0]) { return; }
    
    for (var i = 0; i<arrWorker.length; i++){
        arrWorker[i].terminate();
        arrWorker[i] = undefined;
    }
    
    device.terminate();
    device = undefined;
}

this.addEventListener('message', onMessageDevice, false);