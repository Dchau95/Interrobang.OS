//NEED TO KEEP PROCESSNUMBERI IN INDEXDB

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
            nProcessID: processNumberI,
            sysCall : "Open File",
            fileName : fileName,
            Mode : mode
        };
        document.getElementById("output").innerHTML += "<p>Opening File</p>";
        device.postMessage(task);
    };
    
    /*
     * @param fileName: Name of the file to be closed
              filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.close = function (fileName, filePointer) {
        var task = {
            nProcessID: processNumberI,
            sysCall : "Close File",
            filePointer : filePointer
        };
        document.getElementById("output").innerHTML += "<p>Closing File</p>";
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
        document.getElementById("output").innerHTML += "<p>Creating File</p>";
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
        document.getElementById("output").innerHTML += "<p>Deleting File</p>";
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
        document.getElementById("output").innerHTML += "<p>Reading File</p>";
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
        document.getElementById("output").innerHTML += "<p>Writing File</p>";
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
        document.getElementById("output").innerHTML += "<p>Length of File</p>";
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
        document.getElementById("output").innerHTML += "<p>Seeking Position of File</p>";
        device.postMessage(task);
    };
    
    /*
     * @param filePointer: The number/index that points to the file in arrOpenFiles in IODeviceDriver.js
     */
    this.position = function (filePointer) {
        var task = {
            nProcessID: processNumberI,
            sysCall : "Position of File",
            filePointer : filePointer
        };
        document.getElementById("output").innerHTML += "<p>Position File</p>";
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
        document.getElementById("output").innerHTML += "<p>End of File</p>";
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
    "",
    "",
    "",
//    ""
];

//Array of files to put the result into
var resultFiles = [
    "ResultDummy",
    "Result1.CSV",
    "Result2.CSV",
    "Result3.CSV",
    "Result4.CSV",
    "Result5.CSV",
//    "Result6.CSV"
];

//Array of files for the processes to open
var arrDirectory = [
    "Dummy.CSV",
    "Contact.CSV",
    "Bank.CSV",
    "password.CSV",
    "read.CSV",
    "vector.CSV",
//    "stats.CSV"
];

//Counter for which processes to go
var processNumberI = 0;

//Queue/array for the states of the processes
var statesQueue = [
    { process: "Dummy", processID: 0, EOF: false},
    { process : "Starting", processID: 1, EOF: false},
    { process : "Starting", processID: 2, EOF: false},
    { process : "Starting", processID: 3, EOF: false},
    { process : "Starting", processID: 4, EOF: false},
    { process : "Starting", processID: 5, EOF: false},
//    { process : "Starting", processID: 6, EOF: false}
];

//Array of workers
var arrWorker = [
    new Worker("main.js"),
    contact = new Worker("ContactManager.js"),
    bank = new Worker("BankProcess.js"),
    password = new Worker("passwordchanger.js"),
    read = new Worker("ReadFile.js"),
    vector = new Worker("VectorCalculate.js"),
    //stats = new Worker("StatisticsCalculate.js")
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
            document.getElementById("output").innerHTML += "<p>Process "+statesQueue[processNumberI].processID+" is Starting</p>";
            console.log("Process " + statesQueue[processNumberI].processID + " is Starting");
            os.open(arrDirectory[processNumberI], "Read");
            statesQueue[processNumberI].process = "Waiting";
        } else if (statesQueue[processNumberI].process === "Waiting") {
            document.getElementById("output").innerHTML += "<p>Process "+statesQueue[processNumberI].processID+" is Waiting</p>";
            console.log("Process " + statesQueue[processNumberI].processID + " is waiting");
            statesQueue[processNumberI].process = "Ready";
            break;
        } else if (statesQueue[processNumberI].process === "Ready") {
            document.getElementById("output").innerHTML += "<p>Process "+statesQueue[processNumberI].processID+" is Ready</p>";
            console.log("Process " + statesQueue[processNumberI].processID + " is ready");
            statesQueue[processNumberI].process = "Running";
        } else if (statesQueue[processNumberI].process === "Running") {
            document.getElementById("output").innerHTML += "<p>Process "+statesQueue[processNumberI].processID+" is Running</p>";
            console.log("Process " + statesQueue[processNumberI].processID + " is running");
            if (statesQueue[processNumberI].EOF) {
                statesQueue[processNumberI].process = "Stopping";
            } else {
                os.read(arrDirectory[processNumberI], processNumberI);
                statesQueue[processNumberI].process = "Waiting";
            }
            console.log("Process " + statesQueue[processNumberI].processID + statesQueue[processNumberI].process);
        } else if (statesQueue[processNumberI].process === "Stopping") {
            document.getElementById("output").innerHTML += "<p>Process "+statesQueue[processNumberI].processID+" is Stopping</p>";
            console.log("Process " + statesQueue[processNumberI].processID + " has stopped");
            statesQueue.splice(processNumberI, 1);
            resultFiles.splice(processNumberI, 1);
            resultString.splice(processNumberI, 1);
            arrDirectory.splice(processNumberI, 1);
            arrWorker.splice(processNumberI, 1);
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
        if(typeof arrWorker[task.nProcessID] === 'undefined'){
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
        if(typeof statesQueue[processNumberI] !== 'undefined'){
            statesQueue[processNumberI].EOF = task.checkEOF;
        }
        console.log(task);
    }
}

//Main function
function testingInputOutput() {
    "use strict";    
    device = new Worker("IODeviceDriver.js");
    device.onmessage = onMessageDevice;
    
    document.getElementById("output").innerHTML += "<p>Team Swag OS starting</p>";
    
    whileLoop();
}

//arrWorker[1...6] are functions that get the response from their respective processes
arrWorker[1].onmessage = function (e) {
    document.getElementById("output").innerHTML += "<p>Process 1 has responded with data</p>";
//    if(typeof e.data !== "undefined"){
//        resultString[processNumberI] = e.data;
//    }
    console.log("Result of worker 1 "+resultString[processNumberI]);
    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
    console.log(statesQueue[processNumberI].EOF);
    if(typeof e.data === "undefined"){
        os.close(arrDirectory[processNumberI], processNumberI);
        statesQueue[processNumberI].process = "Stopping";
    } else if (statesQueue[processNumberI].EOF || typeof e.data !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 1</p>";
        console.log("This is the end of the file for process 1");
        statesQueue[processNumberI].process = "Stopping";
        os.close(arrDirectory[processNumberI], processNumberI);
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
};

arrWorker[2].onmessage = function (e) {
    document.getElementById("output").innerHTML += "<p>Process 2 has responded with data</p>";
    resultString[processNumberI] += e.data;
    console.log("Result of worker 2 "+resultString[processNumberI]);
    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
    console.log(statesQueue[processNumberI].EOF);
    if(typeof e.data === "undefined"){
        os.close(arrDirectory[processNumberI], processNumberI);
        statesQueue[processNumberI].process = "Stopping";
    } else if (statesQueue[processNumberI].EOF && typeof e.data !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 2</p>";
        console.log("This is the end of the file for process 2");
        statesQueue[processNumberI].process = "Stopping";
        os.close(arrDirectory[processNumberI], processNumberI);
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
};

arrWorker[3].onmessage = function(e) {
    document.getElementById("output").innerHTML += "<p>Process 3 has responded with data</p>";
    resultString[processNumberI] = e.data;
    console.log("Result of worker 3 "+resultString[processNumberI]);
    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
    console.log(statesQueue[processNumberI].EOF);
    if(typeof e.data === "undefined"){
        os.close(arrDirectory[processNumberI], processNumberI);
        statesQueue[processNumberI].process = "Stopping";
    } else if (statesQueue[processNumberI].EOF || typeof e.data !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 3</p>";
        console.log("This is the end of the file for process 3");
        statesQueue[processNumberI].process = "Stopping";
        os.close(arrDirectory[processNumberI], processNumberI);
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
}

arrWorker[4].onmessage = function(e) {
    document.getElementById("output").innerHTML += "<p>Process 4 has responded with data</p>";
    resultString[processNumberI] += ", "+e.data;
    console.log("Result of worker 4 "+resultString[processNumberI]);
    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
    console.log(statesQueue[processNumberI].EOF);
    if(typeof e.data === "undefined"){
        os.close(arrDirectory[processNumberI], processNumberI);
        statesQueue[processNumberI].process = "Stopping";
    }else if (statesQueue[processNumberI].EOF && typeof e.data !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 4</p>";
        console.log("This is the end of the file for process 4");
        statesQueue[processNumberI].process = "Stopping";
        os.close(arrDirectory[processNumberI], processNumberI);
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
}

arrWorker[5].onmessage = function(e) {
    document.getElementById("output").innerHTML += "<p>Process 5 has responded with data</p>";
    console.log(e.data);
    resultString[processNumberI] = e.data;
    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
    console.log(statesQueue[processNumberI].EOF);
    if(typeof e.data === "undefined"){
        os.close(arrDirectory[processNumberI], processNumberI);
        statesQueue[processNumberI].process = "Stopping";
    } else if (statesQueue[processNumberI].EOF || typeof e.data !== "undefined") {
        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 5</p>";
        console.log("This is the end of the file for process 5");
        statesQueue[processNumberI].process = "Stopping";
        os.close(arrDirectory[processNumberI], processNumberI);
        os.create(resultFiles[processNumberI], "Write");
        os.write(resultFiles[processNumberI], processNumberI, resultString[processNumberI]);
    }
    whileLoop();
}

//arrWorker[6].onmessage = function(e) {
//    document.getElementById("output").innerHTML += "<p>Process 6 has responded with data</p>";
//    console.log(e.data);
//    resultString[processNumberI] = e.data;
//    os.endOfFile(processNumberI, arrDirectory[processNumberI]);
//    console.log(statesQueue[processNumberI].EOF);
//    if(typeof e.data === "undefined"){
//        os.close(arrDirectory[processNumberI], processNumberI);
//        statesQueue[processNumberI].process = "Stopping";
//    } else if (statesQueue[processNumberI].EOF || typeof e.data !== "undefined") {
//        document.getElementById("output").innerHTML += "<p>This is the end of the file for process 6</p>";
//        console.log("This is the end of the file for process 6");
//        statesQueue[processNumberI].process = "Stopping";
//        os.close(arrDirectory[processNumberI], processNumberI);
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