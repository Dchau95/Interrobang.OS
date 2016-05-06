var device;
var nStatesLength;
var userBox = document.getElementById("namebox");
var passBox = document.getElementById("passwordbox");
var button = document.getElementById("submitUserPass");
var input = document.getElementById("inputbox");
var currentUser = "";

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
}

button.addEventListener("click", function(event){
    //fileCsv is gotten from password.CSV or something
    var transact = db.transaction(["root"], "readwrite");
    var store = transact.objectStore("root");
    var index = store.index("by_filename");
    var request = index.get("user.txt");
    request.onsuccess = function(e) {
        console.log(request.result.content);
        var userCheck = {
            username: userBox.value,
            password: passBox.value,
            nProcessID: 1,
            fileCsv: request.result.content
        }
        arrWorker[1].postMessage(userCheck);
        //Normally go to the while loop because the file it's checking might be big
        //    whileLoop();
    }
})

function onMessageLogin(event) {
    //Check if eof
    //if eof, return true/false and change dom accordingly
    //else return to the while loop
    if(!event.data.result) {
        commandOutput("You entered the wrong username/password, enter again\n");
        userBox.value = "";
        passBox.value = "";
    } else {
        input.disabled = false;
        input.focus();
        currentUser = userBox.value;
        document.getElementById("filepath").innerHTML += "C:\\Interrobang\\" + currentUser + ">";
        userBox.parentNode.removeChild(userBox);
        passBox.parentNode.removeChild(passBox);
        button.parentNode.removeChild(button);
        window.onmousedown = function(){return false};
        contentout.innerText = "Welcome! This is Interrobang.OS. It was created by David Chau, Hao Xian Zheng(Benson) Andrew Goff, Tony Tran and Hin Vong. We hope you have fun exploring our OS just as much as we had fun making it. Type Help and hit enter to see the commands!\n";
        statesQueue.splice(1, 1);
        arrWorker[1].terminate();
        arrWorker.splice(1, 1);
    }
}

userBox.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) { 
        button.click();
    }
});

passBox.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) { 
        button.click();
    }
});

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

self.addEventListener('message', onMessageDevice, false);

document.addEventListener('DOMContentLoaded', function() {
    initd();
//    reset();
    logInScreen();
});