var txtbox = document.getElementById("inputbox");
var contentin = document.getElementById("input");
var contentout = document.getElementById("Output");
var fakepathname = document.getElementById("filepath");
var moreFlag = 0;
var charWatchInfo = {
    charWatchFlag: false,
    charPIndex: 0
}
window.onmousedown = function () {return false;};

function changeOutput(text) {
    contentout.innerText = contentout.innerText + "\n" + fakepathname.innerText + text;
}
function changeInput(text) {
    contentin.innerText = contentin.innerText + text;
}

function commandOutput(text){
    contentout.innerText += text;
    txtbox.scrollIntoView();
}

txtbox.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) { //if enter
        if (moreFlag === 1) {
            changeInput("e");
        } else {
            var hold = contentin.innerText + "\n";
            localStorage.setItem("lastCommandText", contentin.innerHTML);
            localStorage.setItem("lastCommand", txtbox.value);
            changeOutput(hold);
            osCMD(txtbox.value);
            contentin.innerText = "";
            inputbox.value = "";
            txtbox.scrollIntoView();
        }
    }
    else if (event.keyCode === 32) { //if space
        changeInput("\u00A0");
        sendToCharWatch(event.keyCode);
    }
    else {
        var hold = String.fromCharCode(event.charCode);
        var processID = charWatchInfo.charPIndex;
        changeInput(hold);
        sendToCharWatch(event.charCode);
    }
});

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

txtbox.addEventListener("keydown", function(event){
    if (event.keyCode === 8) { //if backspace
        var hold = contentin.innerText.slice(0, (contentin.innerText.length - 1));
        contentin.innerText = hold;
    }else if (event.keyCode === 9) { //if tab
        event.preventDefault();
        //Insert code for autocomplete
        //Pattern matching?
    }
    // Get last input if up arrow button is used
    else if (event.keyCode === 38) {
        event.preventDefault();
        if (localStorage.getItem("lastCommand") != null){
            document.getElementById("input").innerHTML = localStorage.getItem("lastCommandText");
            txtbox.value = localStorage.getItem("lastCommand");
        }
    }
    
});