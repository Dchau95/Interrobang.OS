var worker1 = null;
var worker2 = null;
var worker3 = null;
var worker4 = null;
var worker5 = null;
var worker6 = null;
var worker7 = null;
var device = null;
var nProcessID = 1;

function onMessageProcess(event) {
    var task = event.data;
    task.ProcessID = nProcessID;
    
    nProcessID += 1;
    
    console.log(""+event.data);
    console.log(nProcessID);
    
    device.postMessage(task);
}

function onMessageDevice(event) {
    var task = event.data;
    
    console.log("Something here");
    worker.postMessage(task);
}

function testingInputOutput() {
    "use strict";
    console.log("Something here 1");
    if (worker1) {
        console.log("Something here 2");
        return;
    }
    
    console.log("Something here 3");
    worker1 = new Worker("ContactManager.js");
    worker1.postMessage("Hello");
    worker1.onmessage = onMessageProcess;
    
    
    worker2 = new Worker("BankProcess.js");
    worker2.onmessage = onMessageProcess;
    
    worker3 = new Worker("passwordchanger.js");
    worker3.onmessage = onMessageProcess;
    
    worker4 = new Worker("ReadFile.js");
    worker4.onmessage = onMessageProcess;
    
    worker6 = new Worker("StatisticsCalculate.js");
    worker6.onmessage = onMessageProcess;
    
    worker7 = new Worker("VectorCalculate.js");
    worker7.onmessage = onMessageProcess;
    
    device = new Worker("IODeviceDriver.js");
    device.onmessage = onMessageDevice;
    
}

function stopInputOutput() {
    if (!worker1) { return; }
    worker1.terminate();
    worker1 = undefined;
    
    worker2.terminate();
    worker2 = undefined;
    
    worker3.terminate();
    worker3 = undefined;
    
    worker4.terminate();
    worker4 = undefined;
    
    worker6.terminate();
    worker6 = undefined;
    
    worker7.terminate();
    worker7 = undefined;
    
    device.terminate();
    device = undefined;
}