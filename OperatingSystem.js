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
    this.write = function (fileName, filePointer, contents, location) {
        var task = {
//            nProcessID: processID,
            sysCall : "Write File",
            fileName: fileName,
            filePointer : filePointer,
            data : contents,
            location: location
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
var statesQueue = [];

var defaultStart = 0;

//Array of workers
var arrWorker = [];

var semaphoreQueue = [];
var mutexQueue = [];

//Process Scheduler
//Function that operates as the loop for the entire OS until there are no more processes left.
function whileLoop() {
    while (nStatesLength !== 1) {
        if (processNumberI >= statesQueue.length - 1) {
            processNumberI = defaultStart;
        }
        processNumberI += 1;
        console.log("Right fucking here " + processNumberI);
        //If statement checking from top to bottom 
        //which one is in Running
        if (statesQueue[processNumberI].process === "Starting") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" is Starting\n");
            setTimeout(function(){
                os.open(statesQueue[processNumberI].fileCsv, "Read", processNumberI)
            }, 1000);
            statesQueue[processNumberI].process = "Waiting";
        } else if (statesQueue[processNumberI].process === "Waiting") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" is Waiting\n");
            statesQueue[processNumberI].process = "Ready";
            break;
        } else if (statesQueue[processNumberI].process === "Ready") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" is Ready\n");
            statesQueue[processNumberI].process = "Running";
        } else if (statesQueue[processNumberI].process === "Running") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" is Running\n");
            if (statesQueue[processNumberI].EOF) {
                statesQueue[processNumberI].process = "Stopping";
            } else {
                setTimeout(function(){
                    os.read(statesQueue[processNumberI].fileCsv, processNumberI)
                }, 1000);
                statesQueue[processNumberI].process = "Waiting";
            }
        } else if (statesQueue[processNumberI].process === "Stopping") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" is Stopping\n");
            statesQueue[processNumberI].process = "Stopped";
        } else if (statesQueue[processNumberI].process === "Stopped") {
            commandOutput("Process "+statesQueue[processNumberI].processName+" has Stopped\n");
            nStatesLength-=1;
            statesQueue.splice(processNumberI,1);
            arrWorker.splice(processNumberI,1);
            continue;
        }
    }
}

function runContact() {
    var contact = new Worker("ContactManager.js");
    contact.onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processName: "ContactManager", EOF: false, result: "", resultCsv: "Result1.CSV", fileCsv: "Contact.CSV"});
    arrWorker.push(contact);
    nStatesLength+=1;
    whileLoop();
}

function runBank() {
    var bank = new Worker("BankProcess.js");
    bank.onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processName: "BankProcess", EOF: false, result: 0, resultCsv: "Result2.CSV", fileCsv: "Bank.CSV"});
    arrWorker.push(bank);
    nStatesLength+=1;
    whileLoop();
}

function runPassword() {
    var password = new Worker("passwordchanger.js");
    password.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processName: "PasswordProcess", EOF: false, result: "", resultCsv: "Result3.CSV", fileCsv: "password.CSV"});
    arrWorker.push(password);
    nStatesLength+=1;
    whileLoop();
}

function runRead() {
    var read = new Worker("ReadFile.js");
    read.onmessage = onMessageProcess2;
    statesQueue.push({process : "Starting", processName: "ReadProcess", EOF: false, result: "", resultCsv: "Result4.CSV", fileCsv: "read.CSV"});
    arrWorker.push(read);
    nStatesLength+=1;
    whileLoop();
}

function runVector() {
    var vector = new Worker("VectorCalculate.js");
    vector.onmessage = onMessageProcess1;
    statesQueue.push({ process : "Starting", processName: "VectorProcess", EOF: false, result: "", resultCsv: "Result5.CSV", fileCsv: "vector.CSV"});
    arrWorker.push(vector);
    nStatesLength+=1;
    whileLoop();
}

function runStats() {
    var stats = new Worker("StatisticsCalculate.js")
    stats.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processName: "StatsProcess", EOF: false, result: "", resultCsv: "Result6.CSV", fileCsv: "stats.CSV"});
    arrWorker.push(stats);
    nStatesLength+=1;
    whileLoop();
}

function runScript() {
    var commandprocess = new Worker("ScriptProcess.js");
    commandprocess.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processName: "ScriptCreatorProcess", EOF: false, result: 0, resultCsv: "script.sh", fileCsv: "commands.CSV"});
    arrWorker.push(commandprocess);
    nStatesLength+=1;
    whileLoop();
    script("script.sh");
}

function runCharWatch() {
    charWatchInfo.charWatchFlag = true;
    var charWatch = new Worker("CharWatchProcess.js");
    charWatch.onmessage = onMessageCharWatch;
    statesQueue.push({process : "Running", processName: "CharWatchProcess", EOF: false, result: "", resultCsv: "CharWatch.txt", fileCsv: ""});
    arrWorker.push(charWatch);
    charWatchInfo.charPIndex = nStatesLength;
    nStatesLength+=1;
    defaultStart += 1;
}

function runStarter(){
    var starterProcess = new Worker("starter.js");
    starterProcess.onmessage = onMessageStarterProcess;
    statesQueue.push({process: "Starting", processName: "StarterProcess", EOF: false, result: false, resultCsv: "", fileCsv: "maths.CSV"});
    arrWorker.push(starterProcess);
    nStatesLength+=1;
    whileLoop();
}

var sharedArray = [];
for (var i = 0; i<93; i++) {
    sharedArray.push(0);
}

function sendToCharWatch(hold) {
    var processID = charWatchInfo.charPIndex;
    var arg = {
        characterCode: hold,
        nProcessID: processID,
    }
    if(charWatchInfo.charWatchFlag) {
        arrWorker[processID].postMessage(arg);
    }
}

//Do a settimeout for all write functions to simulate 100 characters?
function onMessageCharWatch (e) {
    console.log("Back from process");
    var thread = new Worker("CharWatchThread.js");
    thread.onmessage = onMessageCharThread;
    //Handle mutex
    var data = {
        processNumberI : e.data.processNumberI,
        arrayIndex : e.data.arrayIndex,
        character : e.data.character,
        charArray : sharedArray
    }
    thread.postMessage(data);
}

function onMessageStarterProcess (e) {
    commandOutput("Process "+statesQueue[e.data.processNumberI].processName+" has responded with data\n");
    if(e.data.errorCon !== -1 && e.data.result !== "undefined" && e.data.result !== ""){
        statesQueue[e.data.processNumberI].result = e.data.result;
        console.log("Result");
        console.log(statesQueue[e.data.processNumberI].result);
    }
        os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    if (statesQueue[e.data.processNumberI].EOF != statesQueue[e.data.processNumberI].result != "") {
        commandOutput("This is the end of the file for process "+statesQueue[e.data.processNumberI].processName+"\n");
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        commandOutput("Result is "+statesQueue[e.data.processNumberI].result+"\n");
        console.log("Setting up and starting Mather");
        var matherProcess = new Worker("Maths.js");
        matherProcess.onmessage = onMessageMatherProcess;
        statesQueue.push({process: "Starting", processName: "MathsProcess", EOF: false, result: "", resultCsv: "MathsResult.CSV", fileCsv: "maths.CSV"});
        arrWorker.push(matherProcess);
        nStatesLength+=1;
    }
        whileLoop();
    
}

function onMessageMatherProcess (e) {
    commandOutput("Process "+statesQueue[e.data.processNumberI].processName+" has responded with data\n");
    if(e.data.errorCon !== -1 && e.data.result !== "undefined" && e.data.result !== ""){
        statesQueue[e.data.processNumberI].result = e.data.result;
        console.log("Result");
        console.log(statesQueue[e.data.processNumberI].result);
    }
        os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    if (statesQueue[e.data.processNumberI].EOF != statesQueue[e.data.processNumberI].result != "") {
        commandOutput("This is the end of the file for process "+statesQueue[e.data.processNumberI].processName+"\n");
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result, "result");
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        commandOutput("Result is "+statesQueue[e.data.processNumberI].result+"\n");
    var stats = new Worker("StatisticsCalculate.js")
    stats.onmessage = onMessageProcess1;
    statesQueue.push({process : "Starting", processName: "StatsMatherProcess", EOF: false, result: "", resultCsv: "MathsStatsResult.CSV", fileCsv: "maths.CSV"});
    arrWorker.push(stats);
    nStatesLength+=1;
    }
    whileLoop();
}

function onMessageCharThread (e) {
    console.log("Back from thread");
    sharedArray = e.data.sharedArray;
    commandOutput("Process "+statesQueue[e.data.processNumberI].processName+" has responded with data\n");
    var result = sharedArray.toString()+'\n';
    os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
    os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, result, "result");
    commandOutput("Result is "+result+"\n");
}

function runSleep()
{
    var sleep = new Worker("SleepProcess.js")
    sleep.onmessage = onSleepMessage;// return operation
    statesQueue.push({process : "Starting", processName: "SleepProcess", EOF: false, result: "", resultCsv: "", fileCsv: "sleep.CSV"});
    arrWorker.push(sleep);
    nStatesLength+=1;
    if(semaphoreQueue.length === 0)
        semaphoreQueue.push(new SemaphoreObject(statesQueue[nStatesLength-1].fileCsv));
      
    semaphoreQueue[semaphoreQueue.length-1].P();
    
    whileLoop();
}

function runSignal()
{
    var signal = new Worker("SignalProcess.js");
    signal.onmessage = onSignalMessage;// return operation
    console.log(signal);
    statesQueue.push({process : "Starting", processName: "SignalProcess", EOF: false, result: "", resultCsv: "", fileCsv: "sleep.CSV"});
    arrWorker.push(signal);
    nStatesLength+=1;
    if(semaphoreQueue[semaphoreQueue.length-1].S <= 0) {
        statesQueue[statesQueue.length-1].process = "Running";
//        statesQueue[statesQueue.length-1].EOF = true;
    }
    whileLoop();
}

function runConsumeProcess(argument)
{
    if(argument === "" || typeof argument === 'undefined') {
        commandOutput("You did not specify a file to copy\n");
        return;
    }
    var dummyConsume = new Worker("test.js");
    statesQueue.push({process : "Running", processName: "ConsumeProcess", EOF: false, result: "", resultCsv: "", fileCsv: ""});
    arrWorker.push(dummyConsume);
    nStatesLength+=1;
    defaultStart += 1;
    runConsume(argument);
}

function runPhil()
{
    commandOutput("Check console for state of things\n");
    var phil = new Worker("DinePhil.js");
    phil.onmessage = onPhilMessage;
    statesQueue.push({process : "Starting", processName: "PhilosopherProcess", EOF: false, result: "", resultCsv: "", fileCsv: ""});
    arrWorker.push(phil);
    nStatesLength+=1;
    defaultStart += 1;
    //Post message here
    arrWorker[nStatesLength-1].postMessage({hi: "HI"});
}

function runAddUserGroup(usr, group){
    var transact = db.transaction(["users"], "readwrite");
    var store = transact.objectStore("users");
    var index = store.index("by_username");
    
    index.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            if(cursor.value.username === usr){
                var hold = cursor.value;
                var groupsplit = (hold.groups).split(',');
                var exists = false;
                for(var i = 0; i < groupsplit.length; i++){
                    if(groupsplit[i] === group){
                        commandOutput("User already a member of this group!");
                        exists = true;
                    }
                }
                if(!exists){
                    hold.groups += "," + group;
                    var request = cursor.update(hold);
                    request.onsuccess = function(){
                        console.log("User group updated");
                        commandOutput("User: " + usr + " added to group: " + group);
                        remakeGroupTxt();
                    }
                }
            }
            cursor.continue();
        }
    }
}

function runRemoveUserGroup(usr, group){
    var transact = db.transaction(["users"], "readwrite");
    var store = transact.objectStore("users");
    var index = store.index("by_username");
    
    index.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            if(cursor.value.username === usr){
                var hold = cursor.value;
                var hold2 = "";
                var groupsplit = (hold.groups).split(',');
                console.log(groupsplit.length);
                for(var i = 0; i < groupsplit.length; i++){
                    console.log("I: " + i + " groupsplit[i]: " + groupsplit[i])
                    if(groupsplit[i] !== group && groupsplit[i] !== ""){
                        hold2 += "," + groupsplit[i];
                    }
                }
                hold.groups = hold2;
                var request = cursor.update(hold);
                request.onsuccess = function(){
                    console.log("User group updated");
                    remakeGroupTxt();
                }
            }
            cursor.continue();
        }
    }
}

function remakeGroupTxt(){
    var transact = db.transaction(["users"]);
    var store = transact.objectStore("users");
    var index = store.index("by_username");
    var groupstext = "";
    
    index.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            var hold = cursor.value;
            groupstext += hold.username + ": " + hold.groups + ", ";
            console.log(groupstext);
            cursor.continue();
            remakeGroupTxt2(groupstext);
        }
        
    }
}

function remakeGroupTxt2(text){
    var transact = db.transaction(["root"], "readwrite");
    var store = transact.objectStore("root");
    var index = store.index("by_filename");
    
    index.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
            if (cursor.value.filename === "group.txt"){
                var hold = cursor.value;
                hold.content = text;
                var request = cursor.update(hold);
                request.onsucces = function(){
                    console.log("groups.txt remade");
                    updateMemoryUsage();
                }
            }
            cursor.continue();
        }
    }
}

function osCMD(userInput)
{
    runCMD(userInput);
}

function onPhilMessage(e) {
    //Do something
    commandOutput("The philosophers have reached a deadlock\n");
}

function onSleepMessage(e){
    commandOutput("Process " + statesQueue[e.data.processNumberI].processName + " is  " + e.data.sleepString + "\n");
    console.log(e.data.sleepString);
    
    statesQueue[e.data.processNumberI].process = "Stopping";
    console.log("pre splicing");

    if(e.data.sleepString === "sleepy"){
        console.log("Splciing");
        os.write(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI, e.data.sleepString, "root");
        statesQueue.pop();
        arrWorker.pop();
        nStatesLength-=1;
        runSignal();
    }
    else {
        console.log("Not splicing");
        whileLoop();
    }
}

//starts process 2 to signal back to p1
function onSignalMessage(e){
    console.log(e);
    console.log(statesQueue);
    console.log(e.data.processNumberI);
    commandOutput("Process " + statesQueue[e.data.processNumberI].processName + " is  " + e.data.signalString + "\n");
    
    os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
    
    statesQueue[e.data.processNumberI].process = "Stopping";
    semaphoreQueue[semaphoreQueue.length-1].V();
    runSleep();
}

function onMessageProcess1 (e) {
    commandOutput("Process "+statesQueue[e.data.processNumberI].processName+" has responded with data\n");
    if(e.data.errorCon !== -1 && e.data.result !== "undefined" && e.data.result !== ""){
        statesQueue[e.data.processNumberI].result = e.data.result;
        console.log("Result");
        console.log(statesQueue[e.data.processNumberI].result);
    }
        os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    if (statesQueue[e.data.processNumberI].EOF != statesQueue[e.data.processNumberI].result != "") {
        commandOutput("This is the end of the file for process "+statesQueue[e.data.processNumberI].processName+"\n");
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result, "result");
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        commandOutput("Result is "+statesQueue[e.data.processNumberI].result+"\n");
    }
    whileLoop();
}

function onMessageProcess2 (e) {
    commandOutput("Process "+statesQueue[e.data.processNumberI].processName+" has responded with data\n");
    if(e.data.errorCon !== -1 && e.data.result !== "undefined" && e.data.result !== ""){
        statesQueue[e.data.processNumberI].result += e.data.result;
        console.log("Result");
    }
    os.endOfFile(e.data.processNumberI, statesQueue[e.data.processNumberI].fileCsv);
    console.log(statesQueue[e.data.processNumberI].result);
    if (statesQueue[e.data.processNumberI].EOF != statesQueue[e.data.processNumberI].result != "") {
        commandOutput("This is the end of the file for process "+statesQueue[e.data.processNumberI].processName+"\n");
        os.create(statesQueue[e.data.processNumberI].resultCsv, "Write", e.data.processNumberI);
        os.write(statesQueue[e.data.processNumberI].resultCsv, e.data.processNumberI, statesQueue[e.data.processNumberI].result, "result");
        os.close(statesQueue[e.data.processNumberI].fileCsv, e.data.processNumberI);
        statesQueue[e.data.processNumberI].process = "Stopping";
        commandOutput("Result is "+statesQueue[e.data.processNumberI].result+"\n");
    }
    whileLoop();
}