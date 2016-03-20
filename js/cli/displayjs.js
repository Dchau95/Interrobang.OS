var txtbox = document.getElementById("inputbox");
var contentin = document.getElementById("input");
var contentout = document.getElementById("Output");
var fakepathname = document.getElementById("filepath");

window.onmousedown = function () {return false;};

function changeOutput(text) {
    contentout.innerText = contentout.innerText + fakepathname.innerText + text;
}
function changeInput(text) {
    contentin.innerText = contentin.innerText + text;
}

function commandOutput(text){
    contentout.innerText += text;
}

txtbox.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) { //if enter
        var hold = contentin.innerText + "\n";
        changeOutput(hold);
        runCMD();
        contentin.innerText = "";
        inputbox.value = "";

    }
    else if (event.keyCode === 32) { //if space
        changeInput("\u00A0");
    } 
    else {
        var hold = String.fromCharCode(event.charCode);
        changeInput(hold);
    }
});

txtbox.addEventListener("keydown", function(event){
    if (event.keyCode === 8) { //if backspace
        var hold = contentin.innerText.slice(0, (contentin.innerText.length - 1));
        contentin.innerText = hold;
    }
})
