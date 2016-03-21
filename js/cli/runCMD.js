function runCMD(userInput)
{
    var pointerOne = "";
    var pointerTwo = "";
    var arrFiles = [];
    //perhaps switch to run case rather than 
    //display cmd input
    console.log(userInput);

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

    switch(userInput)
    {
        case "clear":
            clearCMD();
            break;
        case "ls":
            lsCMD();
            break;
        case "man":
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
    try{
        contentout.innerText = "";
    }
    catch(err){
        errorCode = -1;
    }   
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
//    Bottom would be fine for open files
//    var val = 
//    {
//        szMode: "",
//        nPosition: 0,
//        nLength: 0,
//        contents: []
//    }
//
//    arrOpenFiles[copyFileName] = val;
//    arrOpenFiles[copyFileName].szMode = arrOpenFiles[fileName].szMode;
//    arrOpenFiles[copyFileName].nPosition = arrOpenFiles[fileName].nPosition;
//    arrOpenFiles[copyFileName].nLength = arrOpenFiles[fileName].nLength;
//    arrOpenFiles[copyFileName].contents = arrOpenFiles[fileName].contents;
    hashDirectory[copyFileName] = hashDirectory[fileName];
    lsCMD();
    return errorCode;
}

/**
Help manual
clear, ls or dir, delete, copy, ps, kill,
more, cat, man …
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
                statesQueue.splice(1, 1);
                arrWorker[1].terminate();
                arrWorker[1] = undefined;
                break;
            case bankp:
                statesQueue.splice(2, 1);
                arrWorker[2].terminate();
                arrWorker[2] = undefined;
                break;
            case passwordp:
                statesQueue.splice(3, 1);
                arrWorker[3].terminate();
                arrWorker[3] = undefined;
                break;
            case readp:
                statesQueue.splice(4, 1);
                arrWorker[4].terminate();
                arrWorker[4] = undefined;
                break;
            case vectorp:
                statesQueue.splice(5, 1);
                arrWorker[5].terminate();
                arrWorker[5] = undefined;
                break;
            case statsp:
                statesQueue.splice(6, 1);
                arrWorker[6].terminate();
                arrWorker[6] = undefined;
                break;
        }
    }catch(err){
        errorCode = -1;
    }    
    return errorCode;
}