var device;
var nStatesLength;

function initd() {
    device = new Worker('IODeviceDriver.js');
    device.onmessage = onMessageDevice;
    //Push initd into this too as it is a process
    //Its file is init.bat
    statesQueue.push({ process: "Running", processName: "CLI", EOF: false, result: "", resultCsv: "", fileCsv: ""});
    arrWorker.push(new Worker("cli/runCMD.js"));
    nStatesLength = statesQueue.length;
}

function logInScreen() {
    var login = new Worker("LogInScreenProcess.js");
    login.onmessage = onMessageLogin;
    statesQueue.push({ process: "Starting", processName: "Login", EOF: false, result: "", resultCsv: "", fileCsv: ""});
    arrWorker.push(login);
    nStatesLength+=1;
    
}

function onMessageLogin(event) {
    //Check if eof
    //if eof, return true/false and change dom accordingly
    //else return to the while loop
    console.log("Done");
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
        console.log("End of file");
        if(task.nProcessID >= statesQueue.length){
            statesQueue[task.nProcessID-1].EOF = task.checkEOF; 
        }
        else{
            statesQueue[task.nProcessID].EOF = task.checkEOF;
        }
    }
    else if (task.sysCall === "Memory Stats") {
        commandOutput("Total Memory Limit = " + task.memoryLimit + " bytes.\n");
        commandOutput("Total Memory Used = " + task.memoryUsed + " bytes.\n");
        commandOutput("Total Memory Remaining = " + (task.memoryLimit - task.memoryUsed) + " bytes.\n");
    }
    else if (task.sysCall === "Memory failure") {
        kill("consumep");
        commandOutput("OUT OF DISK SPACE ERROR: 12");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initd();
    logInScreen();
});