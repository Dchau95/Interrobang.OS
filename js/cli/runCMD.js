function runCMD(userInput)
{
    var pointerOne = "";
    var pointerTwo = "";
    var arrFiles = [];

    // Check if userInput contains space.
    //Maybe later on, try cat'ing more than two files
    if (userInput.indexOf(' ') >= 0) 
    {
        var command = userInput.split(' ');
        userInput = command[0];
        pointerOne = command[1];
        arrFiles.push(pointerOne);
        if (command.length == 3){
            pointerTwo = command[2];
            arrFiles.push(pointerTwo);
        }
    }

    switch(userInput.toLowerCase())
    {
        case "clear":
            clearCMD();
            break;
        case "ls":
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
            more();
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
            commandOutput("That is not a valid command.\n\n");
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
        commandOutput("\n");
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
    commandOutput("delete : Delete file\n");
    commandOutput("copy : Copy file\n");
    commandOutput("ps : Print process status\n");
    commandOutput("kills : Ends current process\n");
    commandOutput("more : Display output screen\n");
    commandOutput("cat : Display file content\n");
    commandOutput("man : Display help manual\n");
    commandOutput("contactp : Initiates the contact manager process\n");
    commandOutput("bankp : Initiates the bank calculator process\n");
    commandOutput("passwordp : Initiates the password process\n");
    commandOutput("readp : Initiates the sort a list of numbers process\n");
    commandOutput("vectorp : Initiates the vector calculator process\n");
    commandOutput("statsp : Initiates the statistics calculator process\n");
    commandOutput("\n");
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
                commandOutput(hashDirectory[keyName])
        }  
        commandOutput("\n");
    }
    return errorCode;
}

/**
Display output one screen at a time	
*/
function more()
{
    var errorCode = 0;
    //wait for cmd input after more 
    //** wait for cmd input
    while(moreInput != "q" || moreInput != "Q")
    {
        switch(input)
        {
            //Display next page
            case SPACEBAR:
                break;
                
            //Display next line
            case ENTER:
                //** wait for ENTER cmd input
                while(enterInput)
                {
                    
                }
                break;
            //display next file
            case f:
                var arrCount = 1;
                while(arrDirectory.length != arrCount)
                {
                    //** wait for f cmd input
                    if(fInput == "f"){
                        console.log(arrDirectory[i]);
                        arrCount++;
                    }
                    else if(fInput == "q")
                        break;
                }
                break;
                
            //quit
            case q:
                moreInput = "q";
                break;
                
            //show available commands
            case "?":
                console.log("SPACEBAR : Display next page");
                console.log("ENTER : Display next line");
                console.log("f : Display next file");
                console.log("q : quit more command");
                console.log("= : show line numbers");
                
                break;
                
            //show line numbers
            case "=":
                break;

        }// ENd "more" switch loop
        moreInput = "q";
    }//End more input check
    return errorCode;
}//END more function

/** 
Display the process and the state of each running process
*/
function ps()
{
    var errorCode = 0;
    try{
        for(var i = 1; statesQueue.length; i++)
            commandOutput(statesQueue[i].processName + " is currently "
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
            case contactp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ContactManager") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                break;
            case bankp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "BankProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                break;
            case passwordp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "PasswordProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                break;
            case readp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "ReadProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                break;
            case vectorp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "VectorProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker[i] = undefined;
                        arrWorker.splice(i, 1);
                    }
                }
                break;
            case statsp:
                for(var i = 0; i<statesQueue.length; i++){
                    if (statesQueue[i].processName === "StatsProcess") {
                        statesQueue.splice(i, 1);
                        arrWorker[i].terminate();
                        arrWorker.splice(i, 1);
                    }
                }
                break;
        }
        commandOutput("Killed the process\n");
    }catch(err){
        errorCode = -1;
    }    
    return errorCode;
}