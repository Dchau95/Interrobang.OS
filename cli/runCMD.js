function runCMD(userInput)
{
    var pointerOne = "";
    var pointerTwo = "";
    var arrFiles = [];
    var command = userInput.split(' ');
    
    console.log(userInput);

    // Check if userInput contains space.
    //Maybe later on, try cat'ing more than two files
    if (userInput.indexOf(' ') >= 0) 
    {
        userInput = command[0];
        pointerOne = command[1];
        arrFiles.push(pointerOne);
        if (command.length == 3){
            pointerTwo = command[2];
            arrFiles.push(pointerTwo);
        }
    }

    switch(command[0].toLowerCase())
    {
        case "clear":
            clearCMD();
            break;
        case "ls": case "dir":
            lsCMD();
            break;
        case "man": case "help":
            man();
            break;
        case "delete":
            deleteCMD(pointerOne);
            break;
        case "copy":
            copyCMD(pointerOne, pointerTwo);
            break;
        case "ps":
            ps();
            break;
        case "kill":
            kill(pointerOne);
            break;
        case "more":
            more(pointerOne);
            break;
        case "cat":
            cat(arrFiles);
            break;
        case "contactp":
            runContact();
            break;
        case "bankp":
            runBank();
            break;
        case "passwordp":
            runPassword();
            break;
        case "readp":
            runRead();
            break;
        case "statsp":
            runStats();
            break;
        case "vectorp":
            runVector();
            break;
        default:
            commandOutput("That is not a valid command.\n");
            break;
    }
}
            
function clearCMD()
{
    var errorCode = 0;
    contentout.innerText = ""; 
    return errorCode;
}

function lsCMD()
{
    console.log(hashDirectory)
    var errorCode = 0;
    try{
        var keys = Object.keys(hashDirectory);
        for(var i = 0; i<keys.length; i++)
            commandOutput(keys[i]+"\n");
    }catch(err){
        errorCode = -1;
    }
    return errorCode;
}

function deleteCMD(fileName)
{
    if (hashDirectory[fileName] != null)
    {
        delete hashDirectory[fileName];
        lsCMD();
        return 0;
    }
    else
    {
        commandOutput("File does not exist.\n"); 
        return -1;
    }
}

function copyCMD(fileName, copyFileName)
{
    var errorCode = 0;
    hashDirectory[copyFileName] = hashDirectory[fileName];
    lsCMD();
    return errorCode;
}

/**
Help manual
clear, ls or dir, delete, copy, ps, kill, more, cat, man …
*/
function man()
{
    var errorCode = 0;
    commandOutput("clear : Clear terminal screen\n");
    commandOutput("ls or dir : List directory contents\n");
    commandOutput("delete : Delete file. Requires one (or more) parameter\n");
    commandOutput("copy : Copy file. Requires one parameter\n");
    commandOutput("ps : Print process status\n");
    commandOutput("kill : Ends current process. Requires one parameter\n");
    commandOutput("more : Display file output screen. Requires one parameter\n");
    commandOutput("cat : Display file(s) content. Requires one or more parameter\n");
    commandOutput("man : Display help manual\n");
    commandOutput("contactp : Initiates the contact manager process\n");
    commandOutput("bankp : Initiates the bank calculator process\n");
    commandOutput("passwordp : Initiates the password process\n");
    commandOutput("readp : Initiates the sort a list of numbers process\n");
    commandOutput("vectorp : Initiates the vector calculator process\n");
    commandOutput("statsp : Initiates the statistics calculator process\n");
    return errorCode;
}

/**
Concatenate files and print on the standard output	
*/
/**compare array of "files passed in then print"
file elements matching hastable(array of files)
*/
function cat(arrFiles)
{
    var errorCode = 0;
    for(var i=0; i < arrFiles.length; i++)
    {
        for(var keyName in hashDirectory)
        {
            if(arrFiles[i] == keyName)
                commandOutput(hashDirectory[keyName]+"\n");
        }  
    }
    return errorCode;
}

/**
Display output one screen at a time	
-At the moment, even when the more command is active, it allows usage of other linux commands
-When you do = for current line number, it displays it on the console but doesn't go away
-Need to capture the ENTER/return key. For now, just made it e

*/
var moreIncrement = 0;
function more(fileName)
{
    var splitFile = hashDirectory[fileName].match(/.{1,129}/g);
    document.getElementById("filepath").innerHTML = "--more (" + Math.round(100 * (moreIncrement / splitFile.length)) + "%)--";
    var moreInput = contentin.innerText;
    contentin.innerText = "";
    inputbox.value = "";
    //variable that represents how much to print per screen
    var screenful = 5;

    if(moreIncrement === 0)
    {
        //Show initial amount comparable to screen size
        while((moreIncrement < screenful) && (moreIncrement < splitFile.length))
        {
            commandOutput(splitFile[moreIncrement]+"\n");
            moreIncrement = moreIncrement + 1;
        }
    }
    
    switch(moreInput)
    {
        //If input == space, Display next page/Next amount of text the browser can show/allowed to show
        //z is the same, however, any argument will become the new default. Is not implemented
        case "\u00A0": case "z":
            var temp = moreIncrement;
            while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                commandOutput(splitFile[moreIncrement]+"\n");
                moreIncrement = moreIncrement + 1;
            }
            break;
        //Display next line, wrapped around screen, how do capture enter
        case "e":
            commandOutput(splitFile[moreIncrement]+"\n");
            moreIncrement = moreIncrement + 1;
            break;
        //Skip forward k lines and then does SPACEBAR case, where k is defaulted to 1.
        case "s":
            moreIncrement = moreIncrement + 1;
            var temp = moreIncrement;
            commandOutput("... skipping 1 line\n");
            while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                commandOutput(splitFile[moreIncrement]+"\n");
                moreIncrement = moreIncrement + 1;
            }
            break;
        //display next file? Google says Skip forward k screenfuls of text. Defaults to 1.
        // Made it do basically the same thing with "s", but with the screenful part.
        case "f":
            var arrCount = 1;
//            while(arrDirectory.length != arrCount)
//            {
//                //** wait for f cmd input
//                if(fInput == "f"){
//                    console.log(arrDirectory[i]);
//                    arrCount++;
//                }
//                else if(fInput == "q")
//                    break;
//            }
            moreIncrement = moreIncrement + screenful;
            var temp = moreIncrement;
            commandOutput("... skipping 1 screenful of text\n");
            while(moreIncrement < temp+screenful && moreIncrement < splitFile.length){
                commandOutput(splitFile[moreIncrement]+"\n");
                moreIncrement = moreIncrement + 1;
            }
            console.log("Display next file");
            break;
        //quit
        case "q": case "Q":
            moreInput = "q";
            break;
        //Shows current file name and current line number
        case ":f":
            commandOutput("Current file is: "+fileName+" Current line number is: "+moreIncrement+"\n");
            break;
        //show available commands
        case "?": case "h":
            commandOutput("-------------------------------------------------\n");
            commandOutput("? or H - Shows Help page\n");
            commandOutput("SPACEBAR or z - Display next page. With z, any argument becomes new default\n");
            commandOutput("ENTER(e for now) - Display next line\n");
            commandOutput("s - Skips k lines where k is defaulted to 1\n");
            commandOutput("f - Display next file\n");
            commandOutput("q or Q - quit more command\n");
            commandOutput(":f - show current file and line number\n");
            commandOutput("= - show current line number\n");
            commandOutput("-------------------------------------------------\n");
            break;
        //show current line number
        case "=":
            commandOutput("THE CURRENT LINE NUMBER IS: "+moreIncrement+"\n");
            break;
    }// ENd "more" switch loop
    if(moreInput === "q" || moreIncrement >= splitFile.length)
    {
        document.getElementById("filepath").innerHTML = "C:\TeamSwag>";
        moreIncrement = 0;
    }
    else
    {
        setTimeout(function(){
            more(fileName);
        }, 500);
    }
}//END more function

/** 
Display the process and the state of each running process
*/
function ps()
{
    var errorCode = 0;
    try{
        for(var i = 1; i<statesQueue.length; i++)
            commandOutput("Process "+statesQueue[i].processName + " is currently "
                    + statesQueue[i].process+"\n");
    }
    catch(err){
        errorCode = -1;
    }
    return errorCode;
}

/**
Terminate current running process
*/
function kill(processName)
{
    var errorCode = 0;
    try{
        switch(processName){
            case "contactp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ContactManager") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "bankp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "BankProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "passwordp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "PasswordProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "readp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ReadProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n\n");
                break;
            case "vectorp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "VectorProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker[i] = undefined;
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            case "statsp":
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "StatsProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                commandOutput("Killed the process\n");
                break;
            default:
                commandOutput("There was no process to kill.");
        }
    }catch(err){
        errorCode = -1;
    }    
    return errorCode;
}
